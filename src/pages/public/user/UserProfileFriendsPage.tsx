import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { Skeleton, Image } from 'antd';
import avatardf from '../../../assets/images/avatar_default.png';

// Types
interface Friend {
  userId: string;
  firstName: string;
  lastName: string;
  avatarImg?: string;
  mutualFriends?: number;
  location?: string;
}

interface AuthState {
  userId: string;
}

const UserProfileFriendsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Fetch user friends
  const fetchFriends = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockFriends: Friend[] = Array.from({ length: 12 }, (_, i) => ({
        userId: `friend-${i}`,
        firstName: `Nguyễn ${String.fromCharCode(65 + i)}`,
        lastName: `User`,
        avatarImg: "",
        mutualFriends: Math.floor(Math.random() * 50),
        location: `Thành phố ${i + 1}`,
      }));
      setFriends(mockFriends);
      
      // Initialize image loading states
      const loadingStates: { [key: string]: boolean } = {};
      mockFriends.forEach(friend => {
        loadingStates[friend.userId] = true;
      });
      setImageLoading(loadingStates);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchFriends();
  }, [userId]);

  const handleFriendClick = (friendId: string) => {
    navigate(`/user/${friendId}`);
  };

  const filteredFriends = friends.filter(friend => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
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
      {/* Search bar */}
      <div className="relative">
        <Icon 
          icon="lucide:search" 
          className="absolute w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transform -translate-y-1/2 left-2.5 sm:left-3 top-1/2" 
        />
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Friends count */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Tất cả bạn bè ({filteredFriends.length})
        </h3>
      </div>

      {filteredFriends.length === 0 ? (
        <div className="py-8 sm:py-12 text-center">
          <Icon icon="lucide:users" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <p className="text-sm sm:text-base text-gray-500">
            {searchQuery ? "Không tìm thấy bạn bè nào" : "Chưa có bạn bè nào"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredFriends.map((friend) => (
            <div
              key={friend.userId}
              className="p-3 sm:p-4 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md cursor-pointer"
              onClick={() => handleFriendClick(friend.userId)}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                  {imageLoading[friend.userId] && (
                    <Skeleton.Avatar 
                      active 
                      size={64} 
                      shape="circle"
                      className="absolute inset-0"
                    />
                  )}
                  <Image
                    src={friend.avatarImg || avatardf}
                    alt={`${friend.firstName} ${friend.lastName}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    preview={false}
                    onLoad={() => setImageLoading(prev => ({ ...prev, [friend.userId]: false }))}
                    onError={() => setImageLoading(prev => ({ ...prev, [friend.userId]: false }))}
                    style={{ 
                      display: imageLoading[friend.userId] ? 'none' : 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                    {friend.firstName} {friend.lastName}
                  </h4>
                  {friend.location && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Icon icon="lucide:map-pin" className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{friend.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {friend.mutualFriends && friend.mutualFriends > 0 && (
                <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 mb-2.5 sm:mb-3">
                  <Icon icon="lucide:users" className="w-3 h-3 flex-shrink-0" />
                  <span>{friend.mutualFriends} bạn chung</span>
                </div>
              )}
              
              <div className="flex gap-2">
                {currentUserId === userId ? (
                  <button 
                    className="flex items-center justify-center flex-1 gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message action
                      console.log('Send message to', friend.userId);
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
                      navigate(`/home/user/${friend.userId}`);
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
