import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import FriendCard from '../../../components/common/cards/FriendCard';
import { SearchFriendDropdown } from '../../../components/common/dropdowns';
import type { UserResultItemProps } from '../../../components/common/items';

const AllFriendsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock data for all friends
  const allFriends = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 45
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 32
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 28
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 19
    },
    {
      id: 5,
      name: "Mai Phương",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 56
    },
    {
      id: 6,
      name: "Hoàng Tuấn",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 41
    },
    {
      id: 7,
      name: "Linh Chi",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 37
    },
    {
      id: 8,
      name: "Minh Đức",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      mutualFriends: 22
    }
  ];

  const filteredFriends = allFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock search results data
  const [searchResults, setSearchResults] = useState<UserResultItemProps[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
      description: 'Bạn bè'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      description: 'Bạn bè'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
      description: 'Bạn chung'
    }
  ]);

  const removeSearchResult = (id: string) => {
    setSearchResults(results => results.filter(item => item.id !== id));
  };

  // Handle click outside to close search results
  React.useEffect(() => {
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
            {showSearchResults && (
              <SearchFriendDropdown
                searchResults={searchResults}
                onRemove={removeSearchResult}
                onItemClick={(item) => {
                  console.log('Clicked:', item.name);
                }}
                onClose={() => setShowSearchResults(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredFriends.map((friend) => (
          <FriendCard
            key={friend.id}
            id={friend.id}
            name={friend.name}
            avatar={friend.avatar}
            mutualFriends={friend.mutualFriends}
            primaryAction={{
              label: 'Nhắn tin',
              icon: 'fluent:chat-24-filled',
              onClick: () => console.log('Message', friend.id),
              variant: 'secondary'
            }}
            secondaryAction={{
              label: 'Hủy kết bạn',
              onClick: () => console.log('Unfriend', friend.id)
            }}
            onCardClick={() => console.log('View profile', friend.id)}
          />
        ))}
      </div>

      {filteredFriends.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="fluent:people-24-regular" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy bạn bè nào</p>
        </div>
      )}
    </div>
  );
};

export default AllFriendsPage;
