import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { path } from '../utilities/path';

const AdminLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: 'fluent:board-24-regular', label: 'Dashboard', to: path.ADMIN_DASHBOARD },
    { icon: 'fluent:people-24-regular', label: 'Người dùng', to: path.ADMIN_USERS },
    { icon: 'fluent:document-text-24-regular', label: 'Bài viết', to: path.ADMIN_BLOGS },
    { icon: 'fluent:people-community-24-regular', label: 'Nhóm', to: path.ADMIN_GROUPS },
    { icon: 'fluent:flag-24-regular', label: 'Báo cáo', to: path.ADMIN_REPORTS },
    { icon: 'fluent:settings-24-regular', label: 'Cài đặt', to: path.ADMIN_SETTINGS },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 bg-white border-b border-gray-100">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-1 text-base sm:text-lg font-bold text-blue-600">
              <Icon
                icon="fluent:compass-northwest-24-regular"
                className="text-blue-600 w-7 h-7 sm:w-10 sm:h-10 mr-2"
              />
              TravelNest
            </span>
            <p className="text-xs pl-5 text-gray-500 hidden sm:block">
              Quản trị hệ thống
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon icon={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Icon icon="fluent:sign-out-24-regular" className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">Tổng quan hệ thống</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
              <Icon icon="fluent:alert-24-regular" className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Đinh Việt Anh</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
              <img 
                src="https://i.pinimg.com/736x/1b/6a/c1/1b6ac1a458b9979625bc0e9701a42f8d.jpg" 
                alt="Admin Avatar" 
                className="w-9 h-9 rounded-full object-cover border border-blue-200"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
