import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import avatardf from '../../../assets/images/avatar_default.png';
import { path } from '../../../utilities/path';

interface AuthState {
  userId: string | null;
  userName: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  isLoggedIn: boolean;
}

interface LeftSidebarProps {
  onLogout?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = () => {
  const navigate = useNavigate();
  const { userId, userName, fullName, firstName, lastName, avatar } = useSelector((state: { auth: AuthState }) => state.auth);

  // Handle profile click - redirect to user profile page
  const handleProfileClick = () => {
    if (userId) {
      navigate(`/home/user/${userId}`);
    }
  };

  // Display name priority: fullName > firstName + lastName > firstName or lastName > userName > default
  const displayName = fullName || 
    (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName) || 
    userName || 
    'Người dùng';

  // Handler for menu item click
  const handleMenuClick = (route?: string) => {
    if (route) {
      navigate(route);
    } else {
      // Redirect to home if no route is defined
      navigate(path.HOME);
    }
  };

  // Main Menu items
  const mainMenuItems = [
    {
      icon: <Icon icon="fluent:chat-bubbles-question-16-filled" className="w-7 h-7 text-blue-500" />,
      text: 'Tin nhắn',
      hasNotification: true,
      notificationCount: 12,
      route: undefined 
    },
    {
      icon: <Icon icon="fluent:people-16-filled" className="w-7 h-7 text-green-500" />,
      text: 'Bạn bè',
      route: `${path.HOME}/${path.FRIENDS}`
    },
    {
      icon: <Icon icon="fluent:news-16-filled" className="w-7 h-7 text-orange-500" />,
      text: 'Bảng tin',
      isActive: true,
      route: path.HOME
    },
    {
      icon: <Icon icon="fluent:person-24-filled" className="w-7 h-7 text-purple-500" />,
      text: 'Trang cá nhân',
      route: userId ? `${path.HOME}/${path.USER}/${userId}` : path.HOME
    },
    {
      icon: <Icon icon="fluent:people-community-16-filled" className="w-7 h-7 text-indigo-500" />,
      text: 'Nhóm',
      route: `${path.HOME}/${path.GROUPS}`
    },
  ];

  // Explore menu items
  const exploreMenuItems = [
    {
      icon: <Icon icon="fluent:globe-16-filled" className="w-7 h-7 text-green-500" />,
      text: 'Du lịch',
      route: `${path.HOME}/${path.EXPLORE}`
    },
    {
      icon: <Icon icon="fluent:play-circle-16-filled" className="w-7 h-7 text-red-500" />,
      text: 'Watch',
      route: `${path.HOME}/${path.WATCH}`
    },
  ];

  return (
    <div className="w-80 p-4 flex flex-col sticky top-0 h-[calc(100vh-55px)] overflow-y-auto">
      {/* User Profile */}
      <div 
        className="flex items-center mb-6 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -mx-2 transition-colors"
        onClick={handleProfileClick}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img
            src={avatar || avatardf}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = avatardf;
            }}
          />
        </div>
        <span className="font-semibold text-sm text-black truncate">
          {displayName}
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
                <button 
                  onClick={() => handleMenuClick(item.route)}
                  className={`w-full flex items-center p-3 text-left rounded-lg transition-colors cursor-pointer ${item.isActive
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
                <button 
                  onClick={() => handleMenuClick(item.route)}
                  className="w-full flex items-center p-3 text-left hover:bg-gray-100 rounded-lg transition-colors text-black cursor-pointer">
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
