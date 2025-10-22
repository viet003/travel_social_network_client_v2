import React from 'react';
import FriendCard from '../../../components/common/cards/FriendCard';

const FriendRequestsPage: React.FC = () => {
  // Mock data for friend requests
  const friendRequests = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 8,
      timeAgo: "2 giờ"
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 5,
      timeAgo: "1 ngày"
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 12,
      timeAgo: "3 ngày"
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 3,
      timeAgo: "1 tuần"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black mb-2">Lời mời kết bạn</h2>
        <p className="text-gray-600 text-sm">{friendRequests.length} lời mời kết bạn</p>
      </div>

      {/* Friend Requests Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {friendRequests.map((request) => (
          <FriendCard
            key={request.id}
            id={request.id}
            name={request.name}
            avatar={request.avatar}
            mutualFriends={request.mutualFriends}
            timeAgo={request.timeAgo}
            primaryAction={{
              label: 'Xác nhận',
              onClick: () => console.log('Accept friend request', request.id)
            }}
            secondaryAction={{
              label: 'Xóa',
              onClick: () => console.log('Delete friend request', request.id)
            }}
            onCardClick={() => console.log('View profile', request.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequestsPage;
