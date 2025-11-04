import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';
import { apiGetFriendsOfFriendsSuggestions, apiSendFriendRequest } from '../../../services/friendshipService';
import type { FriendshipResponse } from '../../../types/friendship.types';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';

const FriendsHomePage: React.FC = () => {
  const [friendSuggestions, setFriendSuggestions] = useState<FriendshipResponse[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch friend suggestions from API
  const fetchFriendSuggestions = async (pageNum: number = 0) => {
    try {
      showLoading();
      const response = await apiGetFriendsOfFriendsSuggestions(pageNum, 20);
      if (response.success && response.data) {
        setFriendSuggestions(response.data.content);
        setTotalPages(response.data.totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching friend suggestions:', error);
      toast.error('Không thể tải gợi ý bạn bè');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchFriendSuggestions();
  }, []);

  // Handle add friend action
  const handleAddFriend = async (userId: string) => {
    try {
      const response = await apiSendFriendRequest(userId);
      if (response.success) {
        toast.success('Đã gửi lời mời kết bạn');
        // Remove the user from suggestions after sending request
        setFriendSuggestions(prev => prev.filter(friend => friend.friendProfile.userId !== userId));
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Không thể gửi lời mời kết bạn');
    }
  };

  // Handle remove suggestion
  const handleRemoveSuggestion = (userId: string) => {
    setFriendSuggestions(prev => prev.filter(friend => friend.friendProfile.userId !== userId));
    toast.info('Đã gỡ gợi ý');
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="eos-icons:loading" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--travel-primary-500)' }} />
          <p className="text-gray-600">Đang tải gợi ý bạn bè...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Những người bạn có thể biết</h2>
          <p className="text-gray-600 text-sm">Bạn bè của bạn bè - những người bạn có thể quen biết</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchFriendSuggestions(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="ic:round-chevron-left" className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => fetchFriendSuggestions(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="ic:round-chevron-right" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Friend Suggestions Grid */}
      {friendSuggestions.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {friendSuggestions.map((friend, index) => (
            <FriendCard
              key={friend.friendProfile.userId}
              id={index + 1}
              name={friend.friendProfile.userProfile.fullName || friend.friendProfile.userName}
              avatar={friend.friendProfile.avatarImg || 'https://via.placeholder.com/150'}
              mutualFriends={null} // API doesn't provide mutual friends count yet
              followers={null}
              primaryAction={{
                label: 'Thêm bạn bè',
                onClick: () => handleAddFriend(friend.friendProfile.userId || '')
              }}
              secondaryAction={{
                label: 'Gỡ/Xóa',
                onClick: () => handleRemoveSuggestion(friend.friendProfile.userId || '')
              }}
              onCardClick={() => console.log('View profile', friend.friendProfile.userId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon icon="mdi:account-group-outline" className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không có gợi ý bạn bè nào</p>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="text-white p-3 rounded-full shadow-lg transition-colors cursor-pointer"
          style={{ backgroundColor: 'var(--travel-primary-500)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
        >
          <Icon icon="fluent:edit-24-regular" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FriendsHomePage;
