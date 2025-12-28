import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { SimpleCalendar } from "../cards";
import { TripHoverModal } from "../../modal";
import { apiGetUserConversations } from "../../../services/conversationService";
import { apiGetMyGroups } from "../../../services/groupService";
import { apiGetTripsByUserForCalendar } from "../../../services/tripService";
import type { ConversationResponse } from "../../../types/conversation.types";
import type { GroupResponse } from "../../../types/group.types";
import type { TripCalendar } from "../../../types/trip.types";
import { avatarDefault } from "../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { setActiveConversation, addConversation } from "../../../stores/actions/conversationAction";
import { formatChatTime } from "../../../utilities/helper";
import { path } from "../../../utilities/path";
import dayjs from "dayjs";

const RightSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: { auth: { userId: string } }) => state.auth);
  const { userId } = authState;
  
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  
  // Trip calendar states
  const [trips, setTrips] = useState<TripCalendar[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [hoveredTrip, setHoveredTrip] = useState<{ trip: TripCalendar; element: HTMLElement } | null>(null);
  const [currentMonth] = useState(dayjs());

  // Fetch trips for calendar
  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) return;
      
      try {
        setIsLoadingTrips(true);
        // Get trips for current month ± 1 month
        const startDate = currentMonth.subtract(1, 'month').startOf('month').toISOString();
        const endDate = currentMonth.add(1, 'month').endOf('month').toISOString();
        
        const response = await apiGetTripsByUserForCalendar(userId, startDate, endDate);
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoadingTrips(false);
      }
    };

    fetchTrips();
  }, [userId, currentMonth]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const response = await apiGetUserConversations(0, 9, 'PRIVATE');
        // Sort by lastActiveAt descending
        const sortedConversations = response.data.content.sort((a, b) => {
          const dateA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
          const dateB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
          return dateB - dateA;
        });
        setConversations(sortedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch social groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const response = await apiGetMyGroups(0, 8);
        // Sort by lastActivityAt descending
        const sortedGroups = response.data.content.sort((a, b) => {
          const dateA = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
          const dateB = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
          return dateB - dateA;
        });
        setGroups(sortedGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle click on conversation - open chat widget via Redux
  const handleConversationClick = (conversation: ConversationResponse) => {
    // Add to Redux store if not already there
    dispatch(addConversation(conversation));
    // Set as active to open ChatWidget
    dispatch(setActiveConversation(conversation.conversationId));
  };

  // Handle trip hover
  const handleTripHover = (trip: TripCalendar, element: HTMLElement) => {
    setHoveredTrip({ trip, element });
  };

  // Handle trip leave
  const handleTripLeave = () => {
    setHoveredTrip(null);
  };

  // Handle date click - navigate to trips page
  const handleDateClick = (_date: dayjs.Dayjs, trips?: TripCalendar[]) => {
    if (trips && trips.length > 0) {
      // If there are trips, navigate to first trip detail
      navigate(`${path.HOME}/${path.TRIP_DETAIL.replace(':tripId', trips[0].tripId)}`);
    }
  };

  return (
    <div className="w-80 bg-white p-4 sticky top-0 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Calendar Section */}
      <div className="mb-6">
        <h3 className="font-bold text-black mb-4">Lịch trình của bạn</h3>
        {isLoadingTrips ? (
          <div className="flex justify-center py-8">
            <Icon icon="eos-icons:loading" className="w-8 h-8 text-blue-500" />
          </div>
        ) : (
          <SimpleCalendar
            trips={trips}
            onDateClick={handleDateClick}
            onTripHover={handleTripHover}
            onTripLeave={handleTripLeave}
            eventColor="#1890ff"
          />
        )}
      </div>

      {/* Trip Hover Modal */}
      {hoveredTrip && (
        <TripHoverModal
          trip={hoveredTrip.trip}
          anchorElement={hoveredTrip.element}
          onClose={handleTripLeave}
        />
      )}

      {/* Contacts Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Trò chuyện</h3>
        </div>

        {/* Conversation List */}
        {isLoadingConversations ? (
          <div className="flex justify-center py-8 max-h-[300px] items-center">
            <Icon icon="eos-icons:loading" className="w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => {
                const displayName = conversation.conversationName || 'Người dùng';
                const displayAvatar = conversation.conversationAvatar || avatarDefault;
                const timeText = formatChatTime(conversation.lastActiveAt);

                return (
                  <div
                    key={conversation.conversationId}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                          src={displayAvatar}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = avatarDefault;
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-black truncate">
                          {displayName}
                        </span>
                        {timeText && (
                          <span className="text-xs text-gray-500 ml-2">
                            {timeText}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Icon icon="solar:chat-line-linear" className="w-12 h-12 mb-2" />
                <p className="text-sm text-gray-500">
                  Chưa có cuộc trò chuyện nào
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Groups Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Nhóm</h3>
        </div>

        {/* Groups List */}
        {isLoadingGroups ? (
          <div className="flex justify-center py-8 max-h-[250px] items-center">
            <Icon icon="eos-icons:loading" className="w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <div className="space-y-1 max-h-[250px] overflow-y-auto">
            {groups.length > 0 ? (
              groups.map((group) => {
                const displayName = group.groupName || 'Nhóm';
                const displayAvatar = group.coverImageUrl || avatarDefault;
                const memberCount = group.memberCount || 0;

                return (
                  <div
                    key={group.groupId}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => navigate(`${path.HOME}/${path.GROUPS}/${group.groupId}`)}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = avatarDefault;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-black truncate">
                          {displayName}
                        </span>
                        {group.privacy && (
                          <Icon icon="mdi:lock" className="w-3 h-3 text-gray-400 ml-1" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {memberCount} thành viên
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Icon icon="solar:users-group-rounded-linear" className="w-12 h-12 mb-2" />
                <p className="text-sm text-gray-500">
                  Chưa có nhóm nào
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-4 right-4 w-12 h-12 bg-white hover:bg-gray-100 text-black shadow-lg hover:shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 z-50 cursor-pointer border border-gray-200">
        <Icon
          icon="fluent:magic-wand-16-filled"
          className="w-6 h-6 text-black"
        />
      </button>
    </div>
  );
};

export default RightSidebar;
