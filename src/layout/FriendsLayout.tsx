import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';
import { subLogo } from '../assets/images';

const FriendsLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const menuItems = [
    {
      path: '',
      icon: 'fluent:people-24-filled',
      label: 'Trang chủ',
      title: 'Bạn bè',
      end: true
    },
    {
      path: path.FRIENDS_REQUESTS,
      icon: 'fluent:person-add-24-filled',
      label: 'Lời mời kết bạn',
      title: 'Lời mời kết bạn',
      hasChevron: true
    },
    {
      path: path.FRIENDS_SUGGESTIONS,
      icon: 'fluent:person-add-24-filled',
      label: 'Gợi ý',
      title: 'Gợi ý',
      hasChevron: true
    },
    {
      path: path.FRIENDS_ALL,
      icon: 'fluent:people-24-filled',
      label: 'Tất cả bạn bè',
      title: 'Tất cả bạn bè',
      hasChevron: true
    },
    {
      path: path.FRIENDS_BIRTHDAYS,
      icon: 'fluent:gift-24-filled',
      label: 'Sinh nhật',
      title: 'Sinh nhật',
      hasChevron: false
    },
    {
      path: path.FRIENDS_CUSTOM_LISTS,
      icon: 'fluent:person-note-24-filled',
      label: 'Danh sách tùy chỉnh',
      title: 'Danh sách tùy chỉnh',
      hasChevron: true
    }
  ];

  // Get current page title based on active route
  const getCurrentTitle = () => {
    const currentPath = location.pathname.replace('/home/friends', '').replace('/', '');
    const activeItem = menuItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.title : 'Bạn bè';
  };

  return (
    <div className="bg-gray-50 flex min-h-[calc(100vh-55px)] relative">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50  z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button for Mobile - Fixed position */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Icon 
          icon={isSidebarOpen ? "fluent:dismiss-24-filled" : "fluent:navigation-24-filled"} 
          className="h-6 w-6 text-gray-700" 
        />
      </button>

      {/* Left Sidebar */}
      <div className={`
        w-90 bg-white border-r border-gray-200 
        flex flex-col h-[calc(100vh-55px)]
        fixed lg:sticky top-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl px-1 font-bold text-gray-900">{getCurrentTitle()}</h1>
            <button 
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200 cursor-pointer relative"
              onClick={() => {/* Handle settings click */}}
            >
              <Icon icon="fluent:settings-24-filled" className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? '' : 'bg-gray-300'}`}
                        style={isActive ? { backgroundColor: 'var(--travel-primary-500)' } : {}}
                      >
                        <Icon 
                          icon={item.icon} 
                          className={`h-6 w-6 ${isActive ? 'text-white' : 'text-black'}`} 
                        />
                      </div>
                      <span className={`font-medium text-base ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.hasChevron && (
                      <Icon 
                        icon="fluent:chevron-right-24-regular" 
                        className={`h-5 w-5 ${isActive ? '' : 'text-gray-400'}`}
                        style={isActive ? { color: 'var(--travel-primary-500)' } : {}}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200">
          <div className="flex justify-center">
            <img 
              src={subLogo} 
              alt="Travel Social Network" 
              className="w-auto object-cover h-18 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Outlet */}
      <div className="flex-1 bg-gray-50 w-full lg:w-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default FriendsLayout;
