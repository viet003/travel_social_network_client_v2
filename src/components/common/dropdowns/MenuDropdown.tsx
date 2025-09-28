import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';

interface CreateDropdownProps {
  onClose?: () => void;
}

interface CreateMenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const CreateDropdown: React.FC<CreateDropdownProps> = ({ onClose }) => {
  // Menu items based on the image
  const createMenuItems: CreateMenuItem[] = [
    {
      id: 'post',
      icon: <Icon icon="fluent:edit-24-filled" className="w-6 h-6 text-black" />,
      title: 'Đăng',
      onClick: () => console.log('Create post clicked')
    },
    {
      id: 'story',
      icon: <Icon icon="fluent:book-24-filled" className="w-6 h-6 text-black" />,
      title: 'Tin',
      onClick: () => console.log('Create story clicked')
    },
    {
      id: 'reel',
      icon: <Icon icon="fluent:video-24-filled" className="w-6 h-6 text-black" />,
      title: 'Thước phim',
      onClick: () => console.log('Create reel clicked')
    },
    {
      id: 'life_event',
      icon: <Icon icon="fluent:star-24-filled" className="w-6 h-6 text-black" />,
      title: 'Sự kiện trong đời',
      onClick: () => console.log('Create life event clicked')
    },
    {
      id: 'page',
      icon: <Icon icon="fluent:flag-24-filled" className="w-6 h-6 text-black" />,
      title: 'Trang',
      onClick: () => console.log('Create page clicked')
    },
    {
      id: 'ad',
      icon: <Icon icon="fluent:megaphone-24-filled" className="w-6 h-6 text-black" />,
      title: 'Quảng cáo',
      onClick: () => console.log('Create ad clicked')
    },
    {
      id: 'group',
      icon: <Icon icon="fluent:people-24-filled" className="w-6 h-6 text-black" />,
      title: 'Nhóm',
      onClick: () => console.log('Create group clicked')
    },
    {
      id: 'event',
      icon: <Icon icon="fluent:calendar-24-filled" className="w-6 h-6 text-black" />,
      title: 'Sự kiện',
      onClick: () => console.log('Create event clicked')
    },
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
      const createContainer = document.querySelector('[data-create-container]');

      if (createContainer && !createContainer.contains(target)) {
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
      {/* Create Header */}
      <div className="py-4">
        <div className="px-2">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
      </div>

      <div className="px-2">
        <hr className="border-gray-200 mb-2" />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {createMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center space-x-3 py-2 px-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
               {item.icon}
             </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{item.title}</p>
            </div>
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

export default CreateDropdown;
