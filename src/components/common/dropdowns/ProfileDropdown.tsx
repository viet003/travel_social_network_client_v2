import React, { useState, useEffect } from 'react';
import { Settings, HelpCircle, Moon, MessageSquare, LogOut, ChevronRight, Users } from 'lucide-react';

interface ProfileDropdownProps {
  onClose?: () => void;
  user?: {
    name: string;
    avatar: string;
  };
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  hasArrow?: boolean;
  onClick?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose, user }) => {
  const [showAllPages, setShowAllPages] = useState(false);

  // Sample user data
  const currentUser = user || {
    name: 'Đinh Viet Anh',
    avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=40&h=40&fit=crop&crop=face'
  };

  // Sample pages/profiles
  const userPages = [
    {
      id: '1',
      name: 'Music.For.Youth',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
      icon: '🎵'
    }
  ];

  // Menu items
  const menuItems: MenuItem[] = [
    {
      id: 'settings',
      icon: <Settings className="w-4 h-4 text-black" />,
      title: 'Cài đặt và quyền riêng tư',
      hasArrow: true,
      onClick: () => console.log('Settings clicked')
    },
    {
      id: 'help',
      icon: <HelpCircle className="w-4 h-4 text-black" />,
      title: 'Trợ giúp và hỗ trợ',
      hasArrow: true,
      onClick: () => console.log('Help clicked')
    },
    {
      id: 'display',
      icon: <Moon className="w-4 h-4 text-black" />,
      title: 'Màn hình và trợ năng',
      hasArrow: true,
      onClick: () => console.log('Display clicked')
    },
    {
      id: 'feedback',
      icon: <MessageSquare className="w-4 h-4 text-black" />,
      title: 'Đóng góp ý kiến',
      description: 'CTRL B',
      hasArrow: false,
      onClick: () => console.log('Feedback clicked')
    },
    {
      id: 'logout',
      icon: <LogOut className="w-4 h-4 text-black" />,
      title: 'Đăng xuất',
      hasArrow: false,
      onClick: () => console.log('Logout clicked')
    }
  ];

  // Footer links
  const footerLinks = [
    'Quyền riêng tư',
    'Điều khoản',
    'Quảng cáo',
    'Lựa chọn quảng cáo',
    'Cookie',
    'Xem thêm'
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const profileContainer = document.querySelector('[data-profile-container]');
      
      if (profileContainer && !profileContainer.contains(target)) {
        if (onClose) {
          onClose();
        }
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed px-2 top-[55px] right-[13px] w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[600px] flex flex-col">
      {/* User Profile Section */}
      <div className="py-4">
        <div className="flex items-center space-x-3 mb-3 p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
          </div>
        </div>

        {/* User Pages */}
        {userPages.map((page) => (
          <div key={page.id} className="flex items-center space-x-3 mb-3 p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm">{page.icon}</span>
            </div>
            <span className="text-sm">{page.name}</span>
          </div>
        ))}

        {/* Show All Pages Button */}
        <button 
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          onClick={() => setShowAllPages(!showAllPages)}
        >
          <Users className="w-4 h-4 text-black" />
          <span className="text-sm">Xem tất cả trang cá nhân</span>
        </button>
      </div>
      

      <div className="px-2">
        <hr className="border-gray-200 mb-2" />
      </div>
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                {item.description && (
                  <p className="text-xs">{item.description}</p>
                )}
              </div>
            </div>
            {item.hasArrow && (
              <ChevronRight className="w-4 h-4 text-black" />
            )}
          </button>
        ))}
      </div>

      {/* Footer Links */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-center text-xs text-gray-500 space-x-1">
          {footerLinks.map((link, index) => (
            <React.Fragment key={index}>
              <button className="hover:text-blue-700 hover:underline transition-colors cursor-pointer">
                {link}
              </button>
              {index < footerLinks.length - 1 && (
                <span className="text-gray-300">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
