import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';
import { 
  apiGetPendingFriendRequests, 
  apiAcceptFriendRequest, 
  apiRejectFriendRequest 
} from '../../../services/friendshipService';
import type { FriendshipResponse } from '../../../types/friendship.types';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';
import avatardf from '../../../assets/images/avatar_default.png';

const FriendRequestsPage: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendshipResponse[]>([]);
  const { isLoading, showLoading, hideLoading } = useLoading(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch pending friend requests from API
  const fetchFriendRequests = async (pageNum: number = 0) => {
    try {
      showLoading();
      const response = await apiGetPendingFriendRequests(pageNum, 5);
      if (response.success && response.data) {
        setFriendRequests(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast.error('Không thể tải lời mời kết bạn');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // Handle accept friend request
  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      const response = await apiAcceptFriendRequest(friendshipId);
      if (response.success) {
        // Remove the request from list after accepting
        setFriendRequests(prev => prev.filter(req => req.friendshipId !== friendshipId));
        setTotalElements(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Không thể chấp nhận lời mời kết bạn');
    }
  };

  // Handle reject/delete friend request
  const handleRejectRequest = async (friendshipId: string) => {
    try {
      const response = await apiRejectFriendRequest(friendshipId);
      if (response.success) {
        // Remove the request from list after rejecting
        setFriendRequests(prev => prev.filter(req => req.friendshipId !== friendshipId));
        setTotalElements(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Không thể xóa lời mời kết bạn');
    }
  };

  // Format time ago
  const formatTimeAgo = (createdAt: string | null): string => {
    if (!createdAt) return '';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);
    
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    return `${diffWeeks} tuần`;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icon icon="eos-icons:loading" className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--travel-primary-500)' }} />
          <p className="text-gray-600">Đang tải lời mời kết bạn...</p>
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
            <h2 className="text-xl font-semibold text-black mb-2">Lời mời kết bạn</h2>
            <p className="text-gray-600 text-sm">
              {totalElements > 0 ? `${totalElements} lời mời kết bạn` : 'Không có lời mời kết bạn nào'}
            </p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchFriendRequests(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="ic:round-chevron-left" className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Trang {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => fetchFriendRequests(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="ic:round-chevron-right" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Friend Requests Grid */}
      {friendRequests.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {friendRequests.map((request, index) => (
            <FriendCard
              key={request.friendshipId}
              id={index + 1}
              name={request.friendProfile.userProfile.fullName || request.friendProfile.userName}
              avatar={request.friendProfile.avatarImg || avatardf}
              mutualFriends={null} // API doesn't provide mutual friends count yet
              timeAgo={formatTimeAgo(request.createdAt)}
              primaryAction={{
                label: 'Xác nhận',
                onClick: () => handleAcceptRequest(request.friendshipId)
              }}
              secondaryAction={{
                label: 'Xóa',
                onClick: () => handleRejectRequest(request.friendshipId)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon icon="mdi:account-clock-outline" className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Không có lời mời kết bạn nào</p>
          <p className="text-gray-500 text-sm mt-2">Khi có người gửi lời mời kết bạn, chúng sẽ hiển thị ở đây</p>
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
