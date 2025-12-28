import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../../hooks/useNotification';
import type { NotificationResponse, NotificationTypeEnum } from '../../../../types/notification.types';
import { path } from '../../../../utilities/path';
import '../../../../styles/main-header.css';
import { formatTimeAgo } from '../../../../utilities/helper';
import avatarDefault from '../../../../assets/images/avatar_default.png';

interface NotificationsDropdownProps {
  onClose?: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const navigate = useNavigate();
  
  // Use notification hook for real data and real-time updates
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMore
  } = useNotification();

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'Chưa đọc') {
      return notifications.filter(notification => !notification.read);
    }
    return notifications;
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationTypeEnum): { icon: React.ReactNode; bgColor: string } => {
    const iconMap: Record<NotificationTypeEnum, { icon: string; iconColor: string; bgColor: string }> = {
      NEW_POST: { icon: 'fluent:document-add-24-filled', iconColor: 'text-white', bgColor: 'bg-blue-500' },
      POST_LIKE: { icon: 'fluent:heart-24-filled', iconColor: 'text-white', bgColor: 'bg-red-500' },
      POST_COMMENT: { icon: 'fluent:comment-24-filled', iconColor: 'text-white', bgColor: 'bg-green-500' },
      POST_SHARE: { icon: 'fluent:share-24-filled', iconColor: 'text-white', bgColor: 'bg-purple-500' },
      FRIEND_REQUEST: { icon: 'fluent:person-add-24-filled', iconColor: 'text-white', bgColor: 'bg-blue-500' },
      FRIEND_ACCEPTED: { icon: 'fluent:people-24-filled', iconColor: 'text-white', bgColor: 'bg-green-500' },
      GROUP_INVITE: { icon: 'fluent:people-team-24-filled', iconColor: 'text-white', bgColor: 'bg-indigo-500' },
      GROUP_JOIN_REQUEST: { icon: 'fluent:person-add-24-filled', iconColor: 'text-white', bgColor: 'bg-orange-500' },
      GROUP_JOIN_ACCEPTED: { icon: 'fluent:checkmark-circle-24-filled', iconColor: 'text-white', bgColor: 'bg-green-500' },
      CHAT_MESSAGE: { icon: 'fluent:chat-24-filled', iconColor: 'text-white', bgColor: 'bg-blue-500' },
      MENTION: { icon: 'fluent:mention-24-filled', iconColor: 'text-white', bgColor: 'bg-purple-500' },
      SYSTEM: { icon: 'fluent:info-24-filled', iconColor: 'text-white', bgColor: 'bg-gray-500' }
    };

    const config = iconMap[type] || iconMap.SYSTEM;
    return {
      icon: <Icon icon={config.icon} className={`w-5 h-5 ${config.iconColor}`} />,
      bgColor: config.bgColor
    };
  };



  // Handle notification click
  const handleNotificationClick = async (notification: NotificationResponse) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.notificationId);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'NEW_POST':
      case 'POST_LIKE':
      case 'POST_SHARE':
        // Navigate to the post detail
        if (notification.relatedId) {
          navigate(`${path.HOME}/post/${notification.relatedId}`);
        }
        break;
        
      case 'POST_COMMENT':
        // Check if it's a watch/video comment or post comment based on content
        if (notification.relatedId) {
          // If content mentions "video", navigate to watch detail
          if (notification.content.includes('video')) {
            navigate(`${path.HOME}/watch/${notification.relatedId}`, { state: { scrollToComments: true } });
          } else {
            // Otherwise navigate to post detail
            navigate(`${path.HOME}/post/${notification.relatedId}`, { state: { scrollToComments: true } });
          }
        }
        break;
        
      case 'FRIEND_REQUEST':
        // Navigate to friend requests page: /home/friends/requests
        navigate(`${path.HOME}/${path.FRIENDS}/${path.FRIENDS_REQUESTS}`);
        break;
        
      case 'FRIEND_ACCEPTED':
        // Navigate to sender's profile: /home/user/{userId}
        if (notification.sender?.userId) {
          navigate(`${path.HOME}/user/${notification.sender.userId}`);
        }
        break;
        
      case 'GROUP_INVITE':
      case 'GROUP_JOIN_REQUEST':
      case 'GROUP_JOIN_ACCEPTED':
        // Navigate to group detail: /home/groups/{groupId}
        if (notification.relatedId) {
          navigate(`${path.HOME}/${path.GROUPS}/${notification.relatedId}`);
        }
        break;
        
      case 'CHAT_MESSAGE':
        // For chat messages, just open the home page (chat dropdown will be available in header)
        navigate(path.HOME);
        break;
        
      case 'MENTION':
        // Navigate to the post where user was mentioned
        if (notification.relatedId) {
          navigate(`${path.HOME}/post/${notification.relatedId}`);
        }
        break;
        
      case 'SYSTEM':
        // For system notifications, might not need navigation
        break;
        
      default:
        // Default behavior: navigate to sender's profile if available
        if (notification.sender?.userId) {
          navigate(`${path.HOME}/user/${notification.sender.userId}`);
        }
        break;
    }

    // Close dropdown
    if (onClose) onClose();
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
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
    <div 
      className="fixed top-full px-2 right-[13px] w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[calc(100vh-80px)] flex flex-col"
      data-notification-container
    >
      {/* Notifications Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Thông báo</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={handleMarkAllAsRead}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Đánh dấu tất cả là đã đọc"
          >
            <Icon icon="fluent:checkmark-circle-24-filled" className="w-6 h-6 text-blue-600" />
          </button>
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
          {isLoading && filteredNotifications.length === 0 ? (
            <div className="py-8 px-2 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 text-sm mt-2">Đang tải...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-8 px-2 text-center text-gray-500 text-sm">
              <Icon icon="fluent:mailbox-24-regular" className="w-16 h-16 mx-auto mb-2 text-gray-400" />
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.notificationId} 
                onClick={() => handleNotificationClick(notification)}
                className={`flex px-2 py-4 rounded-xl items-start hover:bg-gray-100 transition-colors cursor-pointer group max-h-30 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0 mr-3 relative">
                  <img
                    src={notification.sender?.avatarImg || avatarDefault}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {/* Icon overlay */}
                   <div className={`absolute -bottom-1 -right-1 w-7 h-7 ${getNotificationIcon(notification.type).bgColor} rounded-full flex items-center justify-center shadow-sm`}>
                     {getNotificationIcon(notification.type).icon}
                   </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex-shrink-0">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>

                <div className="flex-shrink-0 ml-2 flex items-center h-full">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <button 
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add more actions menu here
                    }}
                  >
                    <Icon icon="fluent:more-vertical-24-filled" className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      {hasMore && (
        <div className="p-3 border-t border-gray-200">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            className="w-full text-center text-blue-600 text-sm hover:text-blue-700 hover:underline py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Đang tải...
              </>
            ) : (
              <>
                Xem thông báo trước đó
                <Icon icon="fluent:chevron-down-24-filled" className="w-5 h-5 inline ml-1" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
