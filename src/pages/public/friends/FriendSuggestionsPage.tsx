import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';
import { 
  apiGetFriendsOfFriendsSuggestions, 
  apiSendFriendRequest 
} from '../../../services/friendshipService';
import type { FriendshipResponse } from '../../../types/friendship.types';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';

const FriendSuggestionsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<FriendshipResponse[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch friend suggestions from API (friends of friends)
  const fetchSuggestions = async (pageNum: number = 0) => {
    try {
      showLoading();
      const response = await apiGetFriendsOfFriendsSuggestions(pageNum, 5);
      if (response.success && response.data) {
        setSuggestions(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
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
    fetchSuggestions();
  }, []);

  // Handle add friend
  const handleAddFriend = async (userId: string) => {
    try {
      const response = await apiSendFriendRequest(userId);
      if (response.success) {
        // Remove from suggestions after sending request
        setSuggestions(prev => prev.filter(sug => sug.friendProfile.userId !== userId));
        setTotalElements(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Không thể gửi lời mời kết bạn');
    }
  };

  // Handle remove suggestion
  const handleRemoveSuggestion = (userId: string) => {
    setSuggestions(prev => prev.filter(sug => sug.friendProfile.userId !== userId));
    setTotalElements(prev => prev - 1);
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Những người bạn có thể biết</h2>
            <p className="text-gray-600 text-sm">
              Gợi ý dựa trên bạn bè của bạn bè - {totalElements > 0 ? `${totalElements} gợi ý` : 'Không có gợi ý'}
            </p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchSuggestions(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="ic:round-chevron-left" className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Trang {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => fetchSuggestions(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="ic:round-chevron-right" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {suggestions.map((suggestion, index) => (
            <FriendCard
              key={suggestion.friendProfile.userId}
              id={index + 1}
              name={suggestion.friendProfile.userProfile.fullName || suggestion.friendProfile.userName}
              avatar={suggestion.friendProfile.avatarImg || 'https://via.placeholder.com/150'}
              mutualFriends={null} // API doesn't provide mutual friends count yet
              reason="Bạn bè của bạn bè"
              primaryAction={{
                label: 'Thêm bạn bè',
                onClick: () => handleAddFriend(suggestion.friendProfile.userId || '')
              }}
              secondaryAction={{
                label: 'Gỡ',
                onClick: () => handleRemoveSuggestion(suggestion.friendProfile.userId || '')
              }}
              onCardClick={() => console.log('View profile', suggestion.friendProfile.userId)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon icon="mdi:account-group-outline" className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không có gợi ý bạn bè nào</p>
          <p className="text-gray-500 text-sm mt-2">Kết bạn với nhiều người hơn để nhận gợi ý</p>
        </div>
      )}
    </div>
  );
};

export default FriendSuggestionsPage;
