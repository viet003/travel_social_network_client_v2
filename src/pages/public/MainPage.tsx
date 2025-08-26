import React, { useState, useEffect } from 'react';
import { Search, Plus, BarChart3, User, MessageCircle, Calendar, Package, ShoppingCart, HelpCircle, Settings, LogOut, Send, Paperclip, Mic, MoreVertical, Bell, ChevronDown } from 'lucide-react';
import ChatMessages from '../../components/ChatMessages';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../stores/actions/authAction';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utilities/path';
import { formatLastActiveTime } from '../../utilities/helper';
import { apiGetUserGroupsService } from '../../services/chatService';

// Interface cho group chat từ API
interface GroupChat {
  groupChatId: string;
  groupChatName: string;
  groupChatAvatar: string;
  type: string;
  lastMessage: string;
  lastActiveAt: string;
}

// Interface cho tin nhắn
interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

const MainPage: React.FC = () => {
  // State chính để quản lý dữ liệu
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector((state: any) => state.auth);

  // Fetch danh sách group chats từ API
  const fetchGroupChats = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiGetUserGroupsService(userId, 0, 20);
      if(res?.success) {
        setGroupChats(res?.data?.content);
      }

      // Tự động chọn group đầu tiên nếu có
      if (res && res.length > 0) {
        setSelectedGroupId(res[0].groupChatId);
      } else {
        setSelectedGroupId(null);
      }
    } catch (err) {
      console.error("Error fetching group chats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch group chats");
      setGroupChats([]);
      setSelectedGroupId(null);
    } finally {
      setLoading(false);
    }
  };

  // Load group chats khi component mount
  useEffect(() => {
    if (userId) {
      fetchGroupChats();
    }
  }, [userId]);

  // Helper function để lấy màu cho avatar group
  const getGroupAvatarColor = (index: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-orange-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  // Danh sách menu items
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: User, label: 'Your Profile', active: false },
    { icon: MessageCircle, label: 'Chat', active: true },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Package, label: 'Products', active: false },
    { icon: ShoppingCart, label: 'Cart (2)', active: false },
    { icon: HelpCircle, label: 'Help Center', active: false }
  ];

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (messageInput.trim() && selectedGroupId) {
      console.log('Sending message:', messageInput, 'to group:', selectedGroupId);
      setMessageInput('');
    }
  };

  // Xử lý logout
  const handleLogout = () => {
    dispatch(logout());
    navigate(path.LANDING);
  };

  // Messages mẫu - sẽ được thay thế bằng API call thực tế
  const currentMessages: Message[] = [];

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Window controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-sm mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-base transition-all duration-200 hover:bg-gray-100"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg">
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="relative p-1.5 text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg">
              <MessageCircle size={16} />
            </button>

            <div className="flex items-center gap-1.5 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown size={12} className="text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Menu */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Create New Button */}
          <div className="p-3">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 text-base font-medium cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
              <Plus size={16} />
              Create New
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 overflow-y-auto">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-1 cursor-pointer transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <item.icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                <span className="text-base font-medium">{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-800 mb-1 transition-all duration-200">
              <Settings size={16} className="transition-transform duration-200 hover:rotate-90" />
              <span className="text-base font-medium">Settings</span>
            </div>
            <div 
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut size={16} className="transition-transform duration-200 hover:translate-x-1" />
              <span className="text-base font-medium">Logout</span>
            </div>
          </div>
        </div>

        {/* Group Chats List */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Search Group Chats */}
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search group chats"
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-base transition-all duration-200 hover:bg-gray-50"
                />
              </div>
              <button
                onClick={fetchGroupChats}
                className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg"
                title="Refresh group chats"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading group chats...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-red-500 text-sm mb-2">Failed to load group chats</p>
                <button
                  onClick={fetchGroupChats}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && groupChats.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-gray-500 text-base font-medium mb-1">No group chats found</p>
                <p className="text-gray-400 text-sm">You haven't joined any group chats yet</p>
              </div>
            </div>
          )}

          {/* Group Chats List */}
          {!loading && !error && groupChats.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              {groupChats.map((group, index) => (
                <div
                  key={group.groupChatId}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                    selectedGroupId === group.groupChatId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedGroupId(group.groupChatId)}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Group Avatar */}
                    <div className={`w-10 h-10 rounded-full ${getGroupAvatarColor(index)} flex items-center justify-center text-white font-bold text-base transition-transform duration-200 hover:scale-110 overflow-hidden`}>
                      {group.groupChatAvatar && group.groupChatAvatar.startsWith('http') ? (
                        <img 
                          src={group.groupChatAvatar} 
                          alt={group.groupChatName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        group.groupChatName.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 truncate">{group.groupChatName}</h3>
                        <span className="text-sm text-gray-500">{formatLastActiveTime(group.lastActiveAt)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {group.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedGroupId ? (
            <>
              <ChatMessages selectedContact={selectedGroupId} messages={currentMessages} />
              
              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg">
                    <Mic size={16} />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Write a message"
                      className="w-full px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 text-base transition-all duration-200 hover:bg-gray-50"
                    />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg">
                    <Paperclip size={16} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // No Group Selected State
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md px-4">
                <MessageCircle className="mx-auto mb-6 text-gray-300" size={80} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No conversation selected</h3>
                <p className="text-gray-500">
                  {groupChats.length > 0 
                    ? "Choose a group chat from the sidebar to start messaging"
                    : "You don't have any messages yet. Join a group chat to start chatting!"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;