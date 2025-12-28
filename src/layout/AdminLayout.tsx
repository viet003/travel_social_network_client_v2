import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';
import { logout } from '../stores/actions/authAction';
import { ProfileDropdown, NotificationsDropdown } from '../components/common';
import { useNotification } from '../hooks/useNotification';
import defaultAvatar from '../assets/images/avatar_default.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const authState = useSelector((state: any) => state.auth);
  const { fullName, avatar, role } = authState;
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  // Get unread notification count from hook
  const { refreshUnreadCount } = useNotification();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
    };

    if (showNotificationsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationsDropdown]);

  const navItems = [
    { 
      icon: 'fluent:board-24-regular', 
      activeIcon: 'fluent:board-24-filled', 
      label: 'Dashboard', 
      to: path.ADMIN_DASHBOARD 
    },
    { 
      icon: 'fluent:people-24-regular', 
      activeIcon: 'fluent:people-24-filled', 
      label: 'Người dùng', 
      to: path.ADMIN_USERS 
    },
    { 
      icon: 'fluent:document-text-24-regular', 
      activeIcon: 'fluent:document-text-24-filled', 
      label: 'Bài viết', 
      to: path.ADMIN_BLOGS 
    },
    { 
      icon: 'fluent:people-community-24-regular', 
      activeIcon: 'fluent:people-community-24-filled', 
      label: 'Nhóm', 
      to: path.ADMIN_GROUPS 
    },
    { 
      icon: 'fluent:flag-24-regular', 
      activeIcon: 'fluent:flag-24-filled', 
      label: 'Báo cáo', 
      to: path.ADMIN_REPORTS 
    },
    { 
      icon: 'fluent:settings-24-regular', 
      activeIcon: 'fluent:settings-24-filled', 
      label: 'Cài đặt', 
      to: path.ADMIN_SETTINGS 
    },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname.split('/').pop();
    const item = navItems.find(item => item.to === currentPath);
    return item ? item.label : 'Tổng quan hệ thống';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 transition-all duration-300">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <div className="flex items-center gap-3 text-blue-600 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/admin/dashboard')}>
              <div className="p-2 bg-blue-50 rounded-xl">
                <Icon icon="fluent:compass-northwest-24-filled" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">TravelNest</h1>
                <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
              </div>
            </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    icon={isActive ? item.activeIcon : item.icon} 
                    className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} 
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={() => {
              dispatch(logout());
              navigate(path.LANDING);
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-white hover:text-red-600 transition-all duration-200 group cursor-pointer"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-50 transition-colors">
                <Icon icon="fluent:sign-out-24-regular" className="w-5 h-5 group-hover:text-red-600" />
            </div>
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 flex flex-col min-w-0 bg-gray-50/30">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Icon icon="fluent:compass-northwest-24-filled" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
                <p className="text-xs text-gray-500">Chào mừng trở lại, {fullName?.split(' ').pop() || 'Admin'}!</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <button className="p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-all relative group cursor-pointer">
                  <Icon icon="fluent:search-24-regular" className="w-6 h-6" />
                </button>
                
                <div className="relative z-[1000]" ref={notificationsDropdownRef}>
                  <button 
                    className="p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-all relative group cursor-pointer"
                    onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  >
                    <Icon icon="fluent:alert-24-regular" className="w-6 h-6" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  
                  {showNotificationsDropdown && (
                    <NotificationsDropdown 
                      onClose={() => setShowNotificationsDropdown(false)}
                      onUnreadCountChange={refreshUnreadCount}
                    />
                  )}
                </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>

            <div className="relative z-[1000]" ref={profileDropdownRef}>
              <div 
                className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-900">{fullName || 'Admin User'}</div>
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                      {role === 'ADMIN' ? 'Super Admin' : 'Admin'}
                  </div>
                </div>
                <div className="relative">
                  <img 
                      src={avatar || defaultAvatar} 
                      alt="Admin Avatar" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {showProfileDropdown && (
                <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
