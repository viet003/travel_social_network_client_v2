import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { setActiveConversation, addConversation } from '../../../../stores/actions/conversationAction';
import { apiGetUserConversations } from '../../../../services/conversationService';
import type { ConversationResponse } from '../../../../types/conversation.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch conversations from API
  const fetchConversations = useCallback(async (pageNum: number, reset: boolean = false, filterType?: 'PRIVATE' | 'GROUP') => {
    if (loading || (!reset && !hasMore)) return;
    
    setLoading(true);
    try {
      const response = await apiGetUserConversations(pageNum, 20, filterType);
      const newConversations = response.data.content;
      
      // Dispatch to Redux store so ChatWidget can access conversation data
      newConversations.forEach(conv => {
        dispatch(addConversation(conv));
      });
      
      setConversations(prev => reset ? newConversations : [...prev, ...newConversations]);
      setHasMore(pageNum < response.data.totalPages - 1);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, dispatch]);

  // Load initial conversations
  useEffect(() => {
    fetchConversations(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when tab changes
  useEffect(() => {
    let filterType: 'PRIVATE' | 'GROUP' | undefined;
    if (activeTab === 'Bạn bè') {
      filterType = 'PRIVATE';
    } else if (activeTab === 'Nhóm') {
      filterType = 'GROUP';
    }
    setPage(0);
    setConversations([]);
    setHasMore(true);
    fetchConversations(0, true, filterType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1;
            let filterType: 'PRIVATE' | 'GROUP' | undefined;
            if (activeTab === 'Bạn bè') {
              filterType = 'PRIVATE';
            } else if (activeTab === 'Nhóm') {
              filterType = 'GROUP';
            }
            fetchConversations(nextPage, false, filterType);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, fetchConversations, activeTab]);

  // Convert ConversationResponse to ChatItem format
  const convertToChartItem = (conv: ConversationResponse): ChatItem => {
    const timeAgo = conv.lastActiveAt 
      ? dayjs(conv.lastActiveAt).fromNow()
      : 'Không có hoạt động';
    
    return {
      id: conv.conversationId,
      name: conv.conversationName || 'Không có tên',
      lastMessage: conv.lastMessage || 'Chưa có tin nhắn',
      time: timeAgo,
      avatar: conv.conversationAvatar || 'https://via.placeholder.com/56',
      isUnread: false,
      isOnline: false
    };
  };

  // Filter chat items based on search query (tab filtering is done by API)
  const getFilteredChats = () => {
    let items = conversations.map(convertToChartItem);
    
    if (searchQuery) {
      items = items.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  };

  // Handle click on chat item to open chat window
  const handleChatItemClick = (conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
    if (onClose) {
      onClose();
    }
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
    <div data-chat-container className="fixed px-2 top-[55px] right-[13px] w-[360px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[calc(100vh-80px)] flex flex-col">
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
        {['Tất cả', 'Bạn bè', 'Nhóm'].map((tab) => (
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
        {filteredChats.length === 0 && !loading ? (
          <div className="py-4 px-2 text-center text-gray-500 text-sm">
            Không có cuộc trò chuyện nào
          </div>
        ) : (
          <>
            {filteredChats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => handleChatItemClick(chat.id)}
                className="flex px-2 py-4 rounded-xl items-start hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0 mr-3 relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/56';
                    }}
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
            ))}
            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
            {loading && page === 0 && (
              <div className="py-4 text-center text-gray-500 text-sm">
                Đang tải...
              </div>
            )}
          </>
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
