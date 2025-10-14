import React from 'react';
import { Icon } from '@iconify/react';

const FriendsPage: React.FC = () => {
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
    <div className="bg-white flex min-h-[calc(100vh-55px)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-100 border-r border-gray-300 sticky top-0 overflow-y-auto flex flex-col h-[calc(100vh-55px)]">
        {/* Header */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Bạn bè</h1>
            <button 
              className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer relative"
              onClick={() => {/* Handle settings click */}}
            >
              <Icon icon="fluent:settings-24-regular" className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {/* Active item */}
            <div className="flex items-center justify-between p-3 bg-blue-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon icon="fluent:people-24-filled" className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Trang chủ</span>
              </div>
            </div>

            {/* Other menu items */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:person-add-24-regular" className="h-5 w-5 text-black" />
                </div>
                <span className="text-gray-900 font-medium">Lời mời kết bạn</span>
              </div>
              <Icon icon="fluent:chevron-right-24-regular" className="h-4 w-4 text-gray-600" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:person-add-24-regular" className="h-5 w-5 text-black" />
                </div>
                <span className="text-gray-900 font-medium">Gợi ý</span>
              </div>
              <Icon icon="fluent:chevron-right-24-regular" className="h-4 w-4 text-gray-600" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:people-24-regular" className="h-5 w-5 text-black" />
                </div>
                <span className="text-gray-900 font-medium">Tất cả bạn bè</span>
              </div>
              <Icon icon="fluent:chevron-right-24-regular" className="h-4 w-4 text-gray-600" />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:gift-24-regular" className="h-5 w-5 text-black" />
                </div>
                <span className="text-gray-900 font-medium">Sinh nhật</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-200 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <Icon icon="fluent:person-note-24-regular" className="h-5 w-5 text-black" />
                </div>
                <span className="text-gray-900 font-medium">Danh sách tùy chỉnh</span>
              </div>
              <Icon icon="fluent:chevron-right-24-regular" className="h-4 w-4 text-gray-600" />
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300">
          <a href="https://www.facebook.com/friends/suggestions/" className="text-xs text-gray-600 hover:text-gray-800">
            https://www.facebook.com/friends/suggestions/
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Những người bạn có thể biết</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">Xem tất cả</a>
          </div>

          {/* Friend Suggestions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {friendSuggestions.map((friend) => (
              <div key={friend.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                {/* Profile Picture */}
                <div className="mb-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                {/* Name */}
                <h3 className="text-gray-900 font-medium text-sm mb-2 line-clamp-2">{friend.name}</h3>

                {/* Connection Info */}
                <div className="mb-4">
                  {friend.mutualFriends ? (
                    <div className="flex items-center space-x-1 text-gray-600 text-xs">
                      <Icon icon="fluent:people-24-regular" className="h-3 w-3" />
                      <span>{friend.mutualFriends} bạn chung</span>
                    </div>
                  ) : (
                    <div className="text-gray-600 text-xs">
                      Có {friend.followers} người theo dõi
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Thêm bạn bè
                  </button>
                  <button className="w-full bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors">
                    Gỡ/Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6">
            <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <Icon icon="fluent:edit-24-regular" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
