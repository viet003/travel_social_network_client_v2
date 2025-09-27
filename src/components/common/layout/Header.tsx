import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TravelTooltip from '../../ui/customize/TravelTooltip';
import {
  Search,
  Home,
  Users,
  Play,
  Store,
  Gamepad2,
  Menu,
  MessageCircle,
  Bell,
  ChevronDown
} from 'lucide-react';

import logo from '../../../assets/images/logo.png';
import { path } from '../../../utilities/path';
import SearchResults from '../dropdowns/SearchDropdown';
import { ChatDropdown, NotificationsDropdown, ProfileDropdown, CreateDropdown } from '../dropdowns';

const Header: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const navigate = useNavigate();

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
    <header className="bg-white shadow-xs border-b-[1px] border-gray-200 sticky top-0 z-50 h-14 h-[55px]">
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
              <SearchResults onClose={() => setShowSearchResults(false)} />
            </div>
          )}
        </div>

        {/* Center Section: Navigation Icons - Hidden on Mobile */}
        <div className="hidden xl:flex items-center justify-center space-x-1 flex-1 max-w-6xl xl:max-w-5xl 2xl:max-w-4xl h-full py-1">
          {/* Home Icon */}
          <TravelTooltip title="Trang chủ">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer">
              <Home className="h-5 w-5 2xl:h-8 2xl:w-6 text-black" />
            </button>
          </TravelTooltip>

          {/* Friends Icon - Active */}
          <TravelTooltip title="Bạn bè">
            <div className="relative h-full">
              <button className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer">
                <Users className="h-5 w-5 2xl:h-8 2xl:w-6 text-black" />
              </button>
              <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--travel-primary-500)] rounded-full"></div>
            </div>
          </TravelTooltip>

          {/* Watch Icon */}
          <TravelTooltip title="Watch">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer">
              <Play className="h-5 w-5 2xl:h-8 2xl:w-6 text-black" />
            </button>
          </TravelTooltip>

          {/* Marketplace Icon */}
          <TravelTooltip title="Thị trường">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer">
              <Store className="h-5 w-5 2xl:h-8 2xl:w-6 text-black" />
            </button>
          </TravelTooltip>

          {/* Gaming Icon */}
          <TravelTooltip title="Game">
            <button className="px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:min-w-[80px] xl:min-w-[120px] h-full flex items-center justify-center cursor-pointer">
              <Gamepad2 className="h-5 w-5 2xl:h-8 2xl:w-6 text-black" />
            </button>
          </TravelTooltip>
        </div>

        {/* Right Section: User Actions */}
        <div className="flex items-center space-x-2 flex-1 justify-end max-w-md">
          {/* Menu Icon with Create Dropdown */}
          <TravelTooltip title="Tạo">
            <div className="relative" data-create-container>
              <button 
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              >
                <Menu className="h-5 w-5 text-black" />
              </button>

              {/* Create Dropdown */}
              {showCreateDropdown && (
                <CreateDropdown onClose={() => setShowCreateDropdown(false)} />
              )}
            </div>
          </TravelTooltip>

          {/* Messenger Icon with Dropdown */}
          <TravelTooltip title="Messenger">
            <div className="relative" data-chat-container>
              <button 
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer relative"
                onClick={() => setShowChatDropdown(!showChatDropdown)}
              >
                <MessageCircle className="h-5 w-5 text-black" />
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
                <Bell className="h-5 w-5 text-black" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
              </button>

              {/* Notifications Dropdown */}
              {showNotificationsDropdown && (
                <NotificationsDropdown onClose={() => setShowNotificationsDropdown(false)} />
              )}
            </div>
          </TravelTooltip>

          {/* Profile Picture with Dropdown */}
          <TravelTooltip title="Menu">
            <div className="relative" data-profile-container>
              <button 
                className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer relative"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {/* Dropdown arrow */}
                <ChevronDown className="absolute -bottom-1 -right-1 w-4 h-4 text-black bg-white rounded-full" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <ProfileDropdown 
                  onClose={() => setShowProfileDropdown(false)}
                  user={user}
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
