import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import '../../../../styles/main-header.css';

interface NotificationsDropdownProps {
  onClose?: () => void;
}

interface NotificationItem {
  id: string;
  avatar: string;
  title: string;
  description: string;
  time: string;
  type: 'mention' | 'privacy' | 'developer' | 'post' | 'general';
  isUnread?: boolean;
  icon?: React.ReactNode;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');

  // Sample notification data based on the image
  const notifications: NotificationItem[] = [
    {
      id: '1',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      title: 'Nguyễn Hữu Vỹ đã nhắc đến bạn trong một bình luận.',
      description: '',
      time: '1 ngày',
      type: 'mention',
      isUnread: false,
      icon: <Icon icon="fluent:chat-24-filled" className="w-6 h-6 text-green-600" />
    },
    {
      id: '2',
      avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=40&h=40&fit=crop&crop=face',
      title: 'Bạn đã thay đổi quyền truy cập của travel-social-network vào thông tin cá nhân của mình. Bạn có thể xe...',
      description: '',
      time: '1 tuần',
      type: 'privacy',
      isUnread: true,
      icon: <Icon icon="fluent:shield-24-filled" className="w-6 h-6 text-blue-600" />
    },
    {
      id: '3',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
      title: 'Bạn đã nhận được 2 cảnh báo nhà phát triển cho ứng dụng musicapp của mình.',
      description: '',
      time: '1 tuần',
      type: 'developer',
      isUnread: true,
      icon: <Icon icon="fluent:alert-24-filled" className="w-6 h-6 text-gray-600" />
    },
    {
      id: '4',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
      title: 'musicapp có một cảnh báo nhà phát triển mới: Thay đổi trạng thái ứng dụng',
      description: '',
      time: '1 tuần',
      type: 'developer',
      isUnread: true,
      icon: <Icon icon="fluent:alert-24-filled" className="w-6 h-6 text-gray-600" />
    },
    {
      id: '5',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
      title: 'musicapp có một cảnh báo nhà phát triển mới: Xét duyệt ứng dụng',
      description: '',
      time: '1 tuần',
      type: 'developer',
      isUnread: true,
      icon: <Icon icon="fluent:alert-24-filled" className="w-6 h-6 text-gray-600" />
    },
    {
      id: '6',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      title: 'Lớp Chúng Mình đã đăng thước phim mới: "Đỉnh thực sự nha🥰 #lcm".',
      description: '',
      time: '2 tuần',
      type: 'post',
      isUnread: true,
      icon: <Icon icon="fluent:play-24-filled" className="w-6 h-6 text-blue-600" />
    }
  ];

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'Chưa đọc') {
      return notifications.filter(notification => notification.isUnread);
    }
    return notifications;
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const notificationContainer = document.querySelector('[data-notification-container]');

      if (notificationContainer && !notificationContainer.contains(target)) {
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

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="fixed top-[55px] px-2 right-[13px] w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[calc(100vh-80px)] flex flex-col">
      {/* Notifications Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Thông báo</h2>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Icon icon="fluent:more-vertical-24-filled" className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 px-2 mb-3">
        {['Tất cả', 'Chưa đọc'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeTab === tab
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {/* Earlier Section */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Trước đó</h3>
            <button className="text-blue-600 text-sm hover:text-blue-700 hover:underline cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Notification Items */}
        <div>
          {filteredNotifications.length === 0 ? (
            <div className="py-4 px-2 text-center text-gray-500 text-sm">
              Không có thông báo nào
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="flex px-2 py-4 rounded-xl items-start hover:bg-gray-100 transition-colors cursor-pointer group max-h-30">
                <div className="flex-shrink-0 mr-3 relative">
                  <img
                    src={notification.avatar}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {/* Icon overlay */}
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                     {notification.icon}
                   </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex-shrink-0">
                    {notification.time}
                  </p>
                </div>

                <div className="flex-shrink-0 ml-2 flex items-center h-full">
                  {notification.isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer ml-2">
                    <Icon icon="fluent:more-vertical-24-filled" className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3">
        <button className="w-full text-center text-blue-600 text-sm hover:text-blue-700 hover:underline py-2 cursor-pointer">
          Xem thông báo trước đó
          <Icon icon="fluent:chevron-down-24-filled" className="w-6 h-6 inline ml-1 text-black" />
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
