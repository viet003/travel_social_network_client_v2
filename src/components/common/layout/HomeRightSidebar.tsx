import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { SimpleCalendar } from "../cards";
import { apiGetUserConversations } from "../../../services/conversationService";
import type { ConversationResponse } from "../../../types/conversation.types";
import { avatarDefault } from "../../../assets/images";
import { useDispatch } from "react-redux";
import { setActiveConversation, addConversation } from "../../../stores/actions/conversationAction";
import { formatChatTime } from "../../../utilities/helper";

const RightSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [groups, setGroups] = useState<ConversationResponse[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

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

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoadingGroups(true);
        const response = await apiGetUserConversations(0, 8, 'GROUP');
        // Sort by lastActiveAt descending
        const sortedGroups = response.data.content.sort((a, b) => {
          const dateA = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
          const dateB = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
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

  return (
    <div className="w-80 bg-white p-4 sticky top-0 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Calendar Section */}
      <div className="mb-6">
        <h3 className="font-bold text-black mb-4">Lịch trình của bạn</h3>
        <SimpleCalendar
          events={{
            "2025-11-18": true,
            "2025-11-20": true,
            "2025-11-25": true,
          }}
          onDateClick={(date) => console.log(date.format("YYYY-MM-DD"))}
          eventColor="#1890ff"
        />
      </div>

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
                const displayName = group.conversationName || 'Nhóm';
                const displayAvatar = group.conversationAvatar || avatarDefault;
                const memberCount = group.members?.length || 0;
                const timeText = formatChatTime(group.lastActiveAt);

                return (
                  <div
                    key={group.conversationId}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleConversationClick(group)}
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
                        {timeText && (
                          <span className="text-xs text-gray-500 ml-2">
                            {timeText}
                          </span>
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
