import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';
import { SearchFriendDropdown } from '../../../components/common/dropdowns';
import type { UserResultItemProps } from '../../../components/common/items';
import { apiGetMyFriends, apiUnfriend } from '../../../services/friendshipService';
import { createOrGetPrivateConversation } from '../../../stores/actions/conversationAction';
import type { UserResponse } from '../../../types/friendship.types';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';
import ConfirmDeleteModal from '../../../components/modal/confirm/ConfirmDeleteModal';
import avatardf from '../../../assets/images/avatar_default.png';

const AllFriendsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allFriends, setAllFriends] = useState<UserResponse[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [friendToUnfriend, setFriendToUnfriend] = useState<{ userId: string; name: string } | null>(null);

  // Fetch all friends from API
  const fetchAllFriends = async () => {
    try {
      showLoading();
      const response = await apiGetMyFriends();
      if (response.success && response.data) {
        setAllFriends(response.data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Không thể tải danh sách bạn bè');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);

  // Filter friends based on search query
  const filteredFriends = allFriends.filter(friend =>
    (friend.userProfile.fullName || friend.userName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Convert filtered friends to search results format
  const searchResults: UserResultItemProps[] = filteredFriends.slice(0, 5).map(friend => ({
    id: friend.userId || '',
    name: friend.userProfile.fullName || friend.userName,
    avatar: friend.avatarImg || avatardf,
    description: 'Bạn bè'
  }));

  const removeSearchResult = (id: string) => {
    // This would typically remove from filtered view or unfriend
    console.log('Remove search result:', id);
  };

  // Handle unfriend action
  const handleUnfriend = async (userId: string, friendName: string) => {
    setFriendToUnfriend({ userId, name: friendName });
    setShowConfirmDelete(true);
  };

  const confirmUnfriend = async () => {
    if (!friendToUnfriend) return;

    try {
      const response = await apiUnfriend(friendToUnfriend.userId);
      if (response.success) {
        // Remove friend from list
        setAllFriends(prev => prev.filter(friend => friend.userId !== friendToUnfriend.userId));
        toast.success(`Đã hủy kết bạn với ${friendToUnfriend.name}`);
      }
    } catch (error) {
      console.error('Error unfriending:', error);
      toast.error('Không thể hủy kết bạn');
    } finally {
      setShowConfirmDelete(false);
      setFriendToUnfriend(null);
    }
  };

  // Handle message action - create/get conversation and open chat
  const handleMessage = async (userId: string, friendName: string) => {
    try {
      await dispatch(createOrGetPrivateConversation(userId) as any);
      toast.success(`Đang mở cuộc trò chuyện với ${friendName}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Không thể mở cuộc trò chuyện');
    }
  };

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const searchContainer = document.querySelector('[data-search-container-friends]');

      if (searchContainer && !searchContainer.contains(target)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="eos-icons:loading" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--travel-primary-500)' }} />
          <p className="text-gray-600">Đang tải danh sách bạn bè...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-black mb-2">Tất cả bạn bè</h2>
            <p className="text-gray-600 text-sm mb-2">Quản lý danh sách bạn bè của bạn</p>
            <span className="text-gray-600 text-sm">{allFriends.length} bạn bè</span>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96" data-search-container-friends>
            <Icon icon="fluent:search-24-regular" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 cursor-text"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <SearchFriendDropdown
                searchResults={searchResults}
                onRemove={removeSearchResult}
                onItemClick={(item) => {
                  console.log('Clicked:', item.name);
                  setShowSearchResults(false);
                }}
                onClose={() => setShowSearchResults(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFriends.map((friend, index) => (
            <FriendCard
              key={friend.userId}
              id={index + 1}
              name={friend.userProfile.fullName || friend.userName}
              avatar={friend.avatarImg || avatardf}
              mutualFriends={null} // API doesn't provide mutual friends count yet
              primaryAction={{
                label: 'Nhắn tin',
                icon: 'fluent:chat-24-filled',
                onClick: () => handleMessage(friend.userId || '', friend.userProfile.fullName || friend.userName),
                variant: 'secondary'
              }}
              secondaryAction={{
                label: 'Hủy kết bạn',
                onClick: () => handleUnfriend(friend.userId || '', friend.userProfile.fullName || friend.userName)
              }}
              onCardClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon icon="fluent:people-24-regular" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery ? 'Không tìm thấy bạn bè nào' : 'Bạn chưa có bạn bè nào'}
          </p>
          {!searchQuery && (
            <p className="text-gray-500 text-sm mt-2">Hãy thêm bạn bè để kết nối với mọi người</p>
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {friendToUnfriend && (
        <ConfirmDeleteModal
          isOpen={showConfirmDelete}
          onClose={() => {
            setShowConfirmDelete(false);
            setFriendToUnfriend(null);
          }}
          onConfirm={confirmUnfriend}
          type="unfriend"
          itemName={friendToUnfriend.name}
        />
      )}
    </div>
  );
};

export default AllFriendsPage;
