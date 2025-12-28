import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { Skeleton, Image, Tabs, message } from 'antd';
import { apiGetUserFriendshipLists, apiAcceptFriendRequest, apiRejectFriendRequest } from '../../../services/friendshipService';
import { apiCreateOrGetPrivateConversation } from '../../../services/conversationService';
import { setActiveConversation, addConversation } from '../../../stores/actions/conversationAction';
import type { UserFriendshipListsResponse } from '../../../types/friendship.types';
import avatardf from '../../../assets/images/avatar_default.png';

interface AuthState {
  userId: string;
}

const UserProfileFriendsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
  const [friendshipData, setFriendshipData] = useState<UserFriendshipListsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>('friends');
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Fetch user friendship lists
  const fetchFriendshipLists = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiGetUserFriendshipLists(userId);
      if (response.data) {
        setFriendshipData(response.data);
        
        // Initialize image loading states
        const loadingStates: { [key: string]: boolean } = {};
        response.data.friends.forEach(friend => {
          if (friend.userId) loadingStates[friend.userId] = true;
        });
        response.data.pendingRequests.forEach(req => {
          if (req.friendProfile.userId) loadingStates[req.friendProfile.userId] = true;
        });
        response.data.blockedUsers.forEach(user => {
          if (user.userId) loadingStates[user.userId] = true;
        });
        setImageLoading(loadingStates);
      }
    } catch (err) {
      console.error("Error fetching friendship lists:", err);
      message.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendshipLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await apiAcceptFriendRequest(friendshipId);
      message.success('Đã chấp nhận lời mời kết bạn');
      fetchFriendshipLists();
    } catch (err) {
      console.error('Error accepting request:', err);
      message.error('Không thể chấp nhận lời mời');
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    try {
      await apiRejectFriendRequest(friendshipId);
      message.success('Đã từ chối lời mời kết bạn');
      fetchFriendshipLists();
    } catch (err) {
      console.error('Error rejecting request:', err);
      message.error('Không thể từ chối lời mời');
    }
  };

  const handleFriendClick = (friendId: string) => {
    navigate(`/home/user/${friendId}`);
  };

  const handleSendMessage = async (friendUserId: string) => {
    try {
      // Create or get private conversation
      const response = await apiCreateOrGetPrivateConversation(friendUserId);
      
      if (response.data) {
        const conversation = response.data;
        
        // Add to Redux store
        dispatch(addConversation(conversation));
        
        // Set as active conversation to open ChatWidget
        dispatch(setActiveConversation(conversation.conversationId));
        
        message.success('Đã mở đoạn chat');
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      message.error('Không thể mở đoạn chat');
    }
  };

  // Get data based on active tab
  const getDisplayData = () => {
    if (!friendshipData) return [];
    
    switch (activeTab) {
      case 'pending':
        return friendshipData.pendingRequests.map(req => req.friendProfile);
      case 'blocked':
        return friendshipData.blockedUsers;
      default:
        return friendshipData.friends;
    }
  };

  const displayData = getDisplayData();
  
  const filteredData = displayData.filter(user => {
    const fullName = user.userProfile.fullName || '';
    return fullName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="text-sm sm:text-base text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="flex-1"
          items={[
            {
              key: 'friends',
              label: `Bạn bè (${friendshipData?.friends.length || 0})`,
            },
            {
              key: 'pending',
              label: `Lời mời (${friendshipData?.pendingRequests.length || 0})`,
            },
            {
              key: 'blocked',
              label: `Đã chặn (${friendshipData?.blockedUsers.length || 0})`,
            },
          ]}
        />

        {/* Search bar */}
        <div className="relative sm:w-80">
          <Icon 
            icon="lucide:search" 
            className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" 
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="py-8 sm:py-12 text-center">
          <Icon icon="lucide:users" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <p className="text-sm sm:text-base text-gray-500">
            {searchQuery ? "Không tìm thấy" : "Chưa có dữ liệu"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {activeTab === 'pending' && friendshipData?.pendingRequests.filter(req => {
            const fullName = req.friendProfile.userProfile.fullName || '';
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
          }).map((request) => (
            <div
              key={request.friendshipId}
              className="p-3 sm:p-4 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                <div 
                  className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/home/user/${request.friendProfile.userId}`)}
                >
                  {imageLoading[request.friendProfile.userId || ''] && (
                    <Skeleton.Avatar 
                      active 
                      size={64} 
                      shape="circle"
                      className="absolute inset-0"
                    />
                  )}
                  <Image
                    src={request.friendProfile.avatarImg || avatardf}
                    alt={request.friendProfile.userProfile.fullName || ''}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    preview={false}
                    onLoad={() => setImageLoading(prev => ({ ...prev, [request.friendProfile.userId || '']: false }))}
                    onError={() => setImageLoading(prev => ({ ...prev, [request.friendProfile.userId || '']: false }))}
                    style={{ 
                      display: imageLoading[request.friendProfile.userId || ''] ? 'none' : 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                    {request.friendProfile.userProfile.fullName}
                  </h4>
                  {request.friendProfile.userProfile.location && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Icon icon="lucide:map-pin" className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{request.friendProfile.userProfile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="flex items-center justify-center flex-1 gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                  onClick={() => handleAcceptRequest(request.friendshipId)}
                >
                  <Icon icon="lucide:check" className="w-4 h-4" />
                  Chấp nhận
                </button>
                <button 
                  className="flex items-center justify-center flex-1 gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => handleRejectRequest(request.friendshipId)}
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                  Từ chối
                </button>
              </div>
            </div>
          ))}

          {(activeTab === 'friends' || activeTab === 'blocked') && filteredData.map((user) => (
            <div
              key={user.userId}
              className="p-3 sm:p-4 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                <div 
                  className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 cursor-pointer"
                  onClick={() => handleFriendClick(user.userId || '')}
                >
                  {imageLoading[user.userId || ''] && (
                    <Skeleton.Avatar 
                      active 
                      size={64} 
                      shape="circle"
                      className="absolute inset-0"
                    />
                  )}
                  <Image
                    src={user.avatarImg || avatardf}
                    alt={user.userProfile.fullName || ''}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    preview={false}
                    onLoad={() => setImageLoading(prev => ({ ...prev, [user.userId || '']: false }))}
                    onError={() => setImageLoading(prev => ({ ...prev, [user.userId || '']: false }))}
                    style={{ 
                      display: imageLoading[user.userId || ''] ? 'none' : 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                    {user.userProfile.fullName}
                  </h4>
                  {user.userProfile.location && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Icon icon="lucide:map-pin" className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{user.userProfile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {currentUserId === userId && activeTab === 'friends' ? (
                  <button 
                    className="flex items-center justify-center flex-1 gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(user.userId || '');
                    }}
                  >
                    <Icon icon="lucide:message-circle" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Nhắn tin</span>
                    <span className="sm:hidden">Nhắn</span>
                  </button>
                ) : (
                  <button 
                    className="flex items-center justify-center flex-1 gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/home/user/${user.userId}`);
                    }}
                  >
                    <Icon icon="lucide:user" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Xem trang cá nhân</span>
                    <span className="sm:hidden">Xem</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileFriendsPage;
