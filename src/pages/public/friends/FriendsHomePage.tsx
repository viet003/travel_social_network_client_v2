import React from 'react';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';

const FriendsHomePage: React.FC = () => {
  // Mock data for friend suggestions
  const friendSuggestions = [
    {
      id: 1,
      name: "Mèo Ngủ",
      avatar: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 3,
      followers: null
    },
    {
      id: 2,
      name: "Bác Sĩ Trẻ",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 5,
      followers: null
    },
    {
      id: 3,
      name: "Du Lịch Sinh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 2,
      followers: null
    },
    {
      id: 4,
      name: "Vinhomes Park",
      avatar: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop&crop=face",
      mutualFriends: null,
      followers: 197
    },
    {
      id: 5,
      name: "Nhiếp Ảnh Gia",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 4,
      followers: null
    },
    {
      id: 6,
      name: "Rick Sanchez",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 1,
      followers: null
    },
    {
      id: 7,
      name: "Gấu Trúc",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 6,
      followers: null
    },
    {
      id: 8,
      name: "Stylish Girl",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 2,
      followers: null
    },
    {
      id: 9,
      name: "Office Lady",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 3,
      followers: null
    },
    {
      id: 10,
      name: "Graduate Student",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      mutualFriends: null,
      followers: 89
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Những người bạn có thể biết</h2>
          <p className="text-gray-600 text-sm">Thêm bạn bè mới dựa trên những người bạn có thể quen biết</p>
        </div>
        <a 
          href="#" 
          className="text-sm cursor-pointer hover:underline"
          style={{ color: 'var(--travel-primary-500)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
        >
          Xem tất cả
        </a>
      </div>

      {/* Friend Suggestions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {friendSuggestions.map((friend) => (
          <FriendCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            avatar={friend.avatar}
            mutualFriends={friend.mutualFriends}
            followers={friend.followers}
            primaryAction={{
              label: 'Thêm bạn bè',
              onClick: () => console.log('Add friend', friend.id)
            }}
            secondaryAction={{
              label: 'Gỡ/Xóa',
              onClick: () => console.log('Remove', friend.id)
            }}
            onCardClick={() => console.log('View profile', friend.id)}
          />
        ))}
      </div>

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
