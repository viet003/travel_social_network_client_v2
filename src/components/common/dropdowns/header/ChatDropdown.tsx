import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ChatDropdownProps {
  onClose?: () => void;
}

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isUnread?: boolean;
  isMuted?: boolean;
  hasAttachment?: boolean;
  isOnline?: boolean;
}

const ChatDropdown: React.FC<ChatDropdownProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample chat data
  const chatItems: ChatItem[] = [
    {
      id: '1',
      name: 'Phong Vũ',
      lastMessage: 'Bạn: Ui VA đắp chăn từ tối, đã c...',
      time: '1 phút',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isUnread: false,
      isOnline: true
    },
    {
      id: '2',
      name: 'anh Kien cua em',
      lastMessage: 'Facebook link',
      time: '53 phút',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      isUnread: false,
      isOnline: true
    },
    {
      id: '3',
      name: 'Tháng 11 đi Hà Giang k đi ngu...',
      lastMessage: 'Người lùn mất quyền dân ch...',
      time: '1 giờ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      isUnread: true,
      isOnline: false
    },
    {
      id: '4',
      name: 'MẮt I.., nhằm cc, trọc mù đê',
      lastMessage: 'Bạn: Ái chà chúc em 10đ',
      time: '2 giờ',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=40&h=40&fit=crop&crop=face',
      isUnread: false,
      isOnline: true
    },
    {
      id: '5',
      name: 'Nhóm Boys & Girls Phố',
      lastMessage: 'Tuấn đạo lý: đẳng cấp v',
      time: '3 giờ',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
      isMuted: true,
      isOnline: false
    },
    {
      id: '6',
      name: 'Three Kingdoms',
      lastMessage: 'Bạn đã gửi một file đính kèm',
      time: '4 giờ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      hasAttachment: true,
      isOnline: true
    },
    {
      id: '7',
      name: 'Nguyễn Đức Minh',
      lastMessage: 'Đã bày tỏ cảm xúc 😥 về tin nhắn',
      time: '6 giờ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      isUnread: false,
      isOnline: false
    }
  ];

  // Filter chat items based on active tab
  const getFilteredChats = () => {
    let filtered = chatItems;
    
    if (activeTab === 'Chưa đọc') {
      filtered = chatItems.filter(chat => chat.isUnread);
    } else if (activeTab === 'Nhóm') {
      filtered = chatItems.filter(chat => chat.name.includes('Nhóm') || chat.name.includes('Three Kingdoms'));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const chatContainer = document.querySelector('[data-chat-container]');
      
      if (chatContainer && !chatContainer.contains(target)) {
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

  const filteredChats = getFilteredChats();

  return (
    <div className="fixed px-2 top-[55px] right-[13px] w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[calc(100vh-80px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2 cursor-pointer">
          <h2 className="text-2xl font-bold">Đoạn chat</h2>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Icon icon="fluent:more-vertical-24-filled" className="w-4 h-4 text-black" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Icon icon="fluent:arrow-resize-24-filled" className="w-4 h-4 text-black" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Icon icon="fluent:add-24-filled" className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-2 mb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="fluent:search-24-filled" className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm trên đoạn chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 cursor-text"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 px-2 py-2">
        {['Tất cả', 'Chưa đọc', 'Nhóm'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer ml-auto">
          <Icon icon="fluent:more-vertical-24-filled" className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="py-4 px-2 text-center text-gray-500 text-sm">
            Không có cuộc trò chuyện nào
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div key={chat.id} className="flex px-2 py-4 rounded-xl items-start hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex-shrink-0 mr-3 relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {/* Online indicator */}
                {chat.isOnline && (
                  <div className="absolute bottom-1 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{chat.name}</p>
                  <div className="flex items-center space-x-1">
                    {chat.isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    {chat.isMuted && (
                      <Icon icon="fluent:speaker-mute-24-filled" className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3">
        <button className="w-full text-center text-blue-600 text-sm hover:text-blue-700 hover:underline py-2 cursor-pointer">
          Xem tất cả trong đoạn chat
          <Icon icon="fluent:chevron-down-24-filled" className="w-4 h-4 inline ml-1 text-black" />
        </button>
      </div>
    </div>
  );
};

export default ChatDropdown;
