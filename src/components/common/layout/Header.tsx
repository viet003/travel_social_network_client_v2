import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TravelTooltip from '../../ui/customize/TravelTooltip';
import { Icon } from '@iconify/react';
import {
  Search
} from 'lucide-react';

import logo from '../../../assets/images/logo.png';
import avatardf from '../../../assets/images/avatar_default.png';
import { path } from '../../../utilities/path';
import { SearchResultDropdown, ChatDropdown, NotificationsDropdown, ProfileDropdown, CreateDropdown } from '../dropdowns';
import { useNotification } from '../../../hooks/useNotification';

interface AuthState {
  userId: string | null;
  userName: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  isLoggedIn: boolean;
}

// NavButton component for navigation items with active state
interface NavButtonProps {
  icon: string;
  tooltip: string;
  onClick: () => void;
  isActive: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, tooltip, onClick, isActive }) => {
  return (
    <TravelTooltip title={tooltip}>
      <button 
        onClick={onClick}
        className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer relative"
      >
        <Icon 
          icon={icon} 
          className={`h-5 w-5 2xl:h-8 2xl:w-6 transition-colors duration-200 ${
            isActive ? 'text-blue-600' : 'text-black'
          }`} 
        />
        {isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(80%)] h-1 bg-blue-600 rounded-full"></div>
        )}
      </button>
    </TravelTooltip>
  );
};

const Header: React.FC = () => {
  const { avatar } = useSelector((state: { auth: AuthState }) => state.auth);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Get unread notification count from hook
  const { unreadCount } = useNotification();

  const isRouteActive = (routePath: string): boolean => {
    if (routePath === path.HOME) {
      return location.pathname === path.HOME || location.pathname === `${path.HOME}/`;
    }
    return location.pathname.startsWith(`${path.HOME}/${routePath}`);
  };

  // Handle click outside to close search results
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Tìm container chứa cả search input và search results
      const searchContainer = document.querySelector('[data-search-container]');

      // Kiểm tra xem click có nằm trong search container không
      if (searchContainer && !searchContainer.contains(target)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      // Thêm event listener sau một delay nhỏ để tránh đóng ngay lập tức
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
    <header className="bg-white shadow-xs border-b-[1px] border-gray-200 sticky top-0 z-50 h-[55px]">
      <div className="w-full px-4 h-full flex items-center justify-between">
        {/* Left Section: Logo + Search */}
        <div className="flex items-center space-x-3 flex-1 max-w-md relative" data-search-container>
          {/* Logo */}
          <img src={logo} alt="TravelNest Logo" className="w-20 h-8 cursor-pointer" onClick={() => navigate(path.HOME)} />

          {/* Search Bar - Desktop */}
          <div className="relative flex-1 max-w-65 hidden md:block" style={{ zIndex: 1000! }}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm trên TravelNest"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 cursor-text"
              onFocus={() => setShowSearchResults(true)}
            />
          </div>

          {/* Search Button - Mobile */}
          <TravelTooltip title="Tìm kiếm">
            <button
              className="md:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              onClick={() => setShowSearchResults(true)}
            >
              <Search className="h-5 w-5 text-black" />
            </button>
          </TravelTooltip>

          {/* Search Results Dropdown - Di chuyển vào trong search bar container */}
          {showSearchResults && (
            <div className="fixed top-0 left-0 z-50">
              <SearchResultDropdown onClose={() => setShowSearchResults(false)} />
            </div>
          )}
        </div>

        {/* Center Section: Navigation Icons - Hidden on Mobile */}
        <div className="hidden xl:flex items-center justify-center space-x-1 flex-1 max-w-6xl xl:max-w-5xl 2xl:max-w-4xl h-full py-1">
          {/* Home Icon */}
          <NavButton
            icon="fluent:home-24-filled"
            tooltip="Trang chủ"
            onClick={() => navigate(path.HOME)}
            isActive={isRouteActive(path.HOME)}
          />

          {/* Friends Icon */}
          <NavButton
            icon="fluent:people-24-filled"
            tooltip="Bạn bè"
            onClick={() => navigate(`${path.HOME}/${path.FRIENDS}`)}
            isActive={isRouteActive(path.FRIENDS)}
          />

          {/* Watch Icon */}
          <NavButton
            icon="fluent:play-24-filled"
            tooltip="Watch"
            onClick={() => navigate(`${path.HOME}/${path.WATCH}`)}
            isActive={isRouteActive(path.WATCH)}
          />

          {/* Groups Icon */}
          <NavButton
            icon="fluent:people-community-24-filled"
            tooltip="Nhóm"
            onClick={() => navigate(`${path.HOME}/${path.GROUPS}`)}
            isActive={isRouteActive(path.GROUPS)}
          />

          {/* Explore Icon */}
          <NavButton
            icon="fluent:globe-search-24-filled"
            tooltip="Khám phá dành cho du lịch"
            onClick={() => navigate(`${path.HOME}/${path.EXPLORE}`)}
            isActive={isRouteActive(path.EXPLORE)}
          />
        </div>

        {/* Right Section: User Actions */}
        <div className="flex items-center space-x-2 flex-1 justify-end max-w-md">
          {/* Menu Icon with Create Dropdown */}
          <TravelTooltip title="Menu">
            <div className="relative" data-create-container>
              <button 
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              >
                <Icon icon="fluent:apps-24-filled" className="h-5 w-5 text-black" />
              </button>

              {/* Create Dropdown */}
              {showCreateDropdown && (
                <CreateDropdown onClose={() => setShowCreateDropdown(false)} />
              )}
            </div>
          </TravelTooltip>

          {/* Messenger Icon with Dropdown */}
          <TravelTooltip title="Đoạn chat">
            <div className="relative" data-chat-container>
              <button 
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer relative"
                onClick={() => setShowChatDropdown(!showChatDropdown)}
              >
                <Icon icon="fluent:chat-24-filled" className="h-5 w-5 text-black" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>

              {/* Chat Dropdown */}
              {showChatDropdown && (
                <ChatDropdown  onClose={() => setShowChatDropdown(false)} />
              )}
            </div>
          </TravelTooltip>

          {/* Notifications Icon with Dropdown */}
          <TravelTooltip title="Thông báo">
            <div className="relative" data-notification-container>
              <button 
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer relative"
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              >
                <Icon icon="fluent:alert-24-filled" className="h-5 w-5 text-black" />
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotificationsDropdown && (
                <NotificationsDropdown onClose={() => setShowNotificationsDropdown(false)} />
              )}
            </div>
          </TravelTooltip>

          {/* Profile Picture with Dropdown */}
          <TravelTooltip title="Tài khoản">
            <div className="relative" data-profile-container>
              <button 
                className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer relative"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <img
                  src={avatar || avatardf}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatardf;
                  }}
                />
                {/* Dropdown arrow */}
                <Icon icon="fluent:chevron-down-24-filled" className="absolute -bottom-1 -right-1 w-4 h-4 text-black bg-white rounded-full" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <ProfileDropdown 
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          </TravelTooltip>
        </div>
      </div>
    </header>
  );
};

export default Header;
