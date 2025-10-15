import React from 'react';
import { Icon } from '@iconify/react';

interface LeftSidebarProps {
  user: any;
  onLogout: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ user, onLogout }) => {
  // Main Menu items
  const mainMenuItems = [
    {
      icon: <Icon icon="fluent:chat-bubbles-question-16-filled" className="w-7 h-7 text-blue-500" />,
      text: 'Tin nhắn',
      hasNotification: true,
      notificationCount: 12
    },
    {
      icon: <Icon icon="fluent:people-16-filled" className="w-7 h-7 text-green-500" />,
      text: 'Bạn bè'
    },
    {
      icon: <Icon icon="fluent:news-16-filled" className="w-7 h-7 text-orange-500" />,
      text: 'Bảng tin',
      isActive: true
    },
    {
      icon: <Icon icon="fluent:person-24-filled" className="w-7 h-7 text-purple-500" />,
      text: 'Trang cá nhân'
    },
    {
      icon: <Icon icon="fluent:people-community-16-filled" className="w-7 h-7 text-indigo-500" />,
      text: 'Nhóm'
    },
  ];

  // Explore menu items
  const exploreMenuItems = [
    {
      icon: <Icon icon="fluent:globe-16-filled" className="w-7 h-7 text-green-500" />,
      text: 'Du lịch'
    },
    {
      icon: <Icon icon="fluent:bookmark-16-filled" className="w-7 h-7 text-yellow-500" />,
      text: 'Đã lưu'
    },
    {
      icon: <Icon icon="fluent:thumb-like-16-filled" className="w-7 h-7 text-pink-500" />,
      text: 'Gợi ý'
    },
  ];

  return (
    <div className="w-80 p-4 flex flex-col sticky top-0 h-[calc(100vh-55px)] overflow-y-auto">
      {/* User Profile */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={user?.avatar || user?.profilePicture || '/default-avatar.png'}
            alt={user?.firstName || user?.userName || 'User'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-white font-semibold text-sm bg-blue-500 w-full h-full flex items-center justify-center">${user?.firstName?.charAt(0) || user?.userName?.charAt(0) || 'U'}</span>`;
              }
            }}
          />
        </div>
        <span className="font-semibold text-sm text-black">
          {user?.firstName || user?.userName || 'Đinh Viet Anh'}
        </span>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        {/* Main Menu Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3 px-3 text-black">
            Menu chính
          </h3>
          <ul className="space-y-1">
            {mainMenuItems.map((item, index) => (
              <li key={index}>
                <button className={`w-full flex items-center p-3 text-left rounded-lg transition-colors cursor-pointer ${item.isActive
                  ? 'bg-gray-100 text-black'
                  : 'hover:bg-gray-200 text-black'
                  }`}>
                  <span className="mr-3">
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm text-black">{item.text}</span>
                  {item.hasNotification && (
                    <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.notificationCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore Section */}
        <div>
          <h3 className="text-md font-semibold mb-3 px-3 text-black">
            Khám phá
          </h3>
          <ul className="space-y-1">
            {exploreMenuItems.map((item, index) => (
              <li key={index}>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors text-black cursor-pointer">
                  <span className="mr-3">
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <a href="#" className="hover:underline">Quyền riêng tư</a>
          <span>•</span>
          <a href="#" className="hover:underline">Điều khoản</a>
          <span>•</span>
          <a href="#" className="hover:underline">Quảng cáo</a>
          <span>•</span>
          <a href="#" className="hover:underline">Lựa chọn quảng cáo</a>
          <span>•</span>
          <a href="#" className="hover:underline">Cookie</a>
          <span>•</span>
          <a href="#" className="hover:underline">Xem thêm</a>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
