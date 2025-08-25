import React, { useState, useEffect } from 'react';
import { Search, Plus, BarChart3, User, MessageCircle, Calendar, Package, ShoppingCart, HelpCircle, Settings, LogOut, Send, Paperclip, Mic, MoreVertical, Bell, ChevronDown } from 'lucide-react';
import ChatMessages from '../../components/ChatMessages';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../stores/actions/authAction';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utilities/path';
import { formatLastActiveTime } from '../../utilities/helper';
import { apiGetUserGroupsService } from '../../services/chatService';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  color: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface GroupChatResponse {
  groupChatId: string;
  groupChatName: string;
  groupChatAvatar: string;
  type: string;
  lastMessage: string;
  lastActiveAt: string;
}

const MainPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [groups, setGroups] = useState<GroupChatResponse[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userId } = useSelector((state: any) => state.auth);

  // Fetch user groups from API
  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/user/groupchats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth method
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const groupChats: GroupChatResponse[] = data.data || data || []; // Adjust based on your API response structure
      setGroups(groupChats);
      
      // Convert group chats to contacts format
      if (groupChats && groupChats.length > 0) {
        const groupContacts: Contact[] = groupChats.map((group: GroupChatResponse, index: number) => ({
          id: group.groupChatId,
          name: group.groupChatName,
          avatar: group.groupChatAvatar || group.groupChatName.charAt(0).toUpperCase(),
          lastMessage: group.lastMessage || 'No messages yet',
          time: formatLastActiveTime(group.lastActiveAt),
          color: getGroupColor(index)
        }));
        
        setContacts(groupContacts);
        // Auto select first group if available
        setSelectedContact(groupContacts[0].id);
      } else {
        setContacts([]);
        setSelectedContact(null);
      }
    } catch (err) {
      console.error('Error fetching user group chats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch group chats');
      setContacts([]);
      setSelectedContact(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await apiGetUserGroupsService(userId, page, 10);
        setGroups(res?.data || []); // tuỳ vào cấu trúc trả về của API
      } catch (err) {
        setGroups([]);
      }
    };
    if (userId) fetchGroups();
  }, [userId]);

  // Helper function to get group color
  const getGroupColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  // Load groups on component mount
  useEffect(() => {
    fetchUserGroups();
  }, []);

  // Messages data for each contact (you might want to fetch this from API too)
  const allMessages: { [key: string]: Message[] } = {
    // This would be populated from API calls when a contact is selected
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: User, label: 'Your Profile', active: false },
    { icon: MessageCircle, label: 'Chat', active: true },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Package, label: 'Products', active: false },
    { icon: ShoppingCart, label: 'Cart (2)', active: false },
    { icon: HelpCircle, label: 'Help Center', active: false }
  ];

  const handleSendMessage = () => {
    if (message.trim() && selectedContact) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message, 'to group:', selectedContact);
      setMessage('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(path.LANDING);
  };

  const handleRefreshGroups = () => {
    fetchUserGroups();
  };

  // Get current messages for selected contact
  const currentMessages = selectedContact ? allMessages[selectedContact] || [] : [];

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left side - Window controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"></div>
          </div>

          {/* Center - Search */}
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

          {/* Right side - Notifications and Profile */}
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
        {/* Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Create New Button */}
          <div className="p-3">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 text-base font-medium cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
              <Plus size={16} />
              Create New
            </button>
          </div>

          {/* Menu Items */}
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

          {/* Bottom Menu */}
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

        {/* Contacts List */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Search Header */}
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
                onClick={handleRefreshGroups}
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
                  onClick={handleRefreshGroups}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && contacts.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-gray-500 text-base font-medium mb-1">No group chats found</p>
                <p className="text-gray-400 text-sm">You haven't joined any group chats yet</p>
              </div>
            </div>
          )}

          {/* Contacts */}
          {/* {!loading && !error && contacts.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                    selectedContact === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedContact(contact.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center text-white font-bold text-base transition-transform duration-200 hover:scale-110 overflow-hidden`}>
                      {contact.avatar.startsWith('http') ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        contact.avatar
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 truncate">{contact.name}</h3>
                        <span className="text-sm text-gray-500">{contact.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{contact.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedContact ? (
            <>
              <ChatMessages selectedContact={selectedContact} messages={currentMessages} />
              
              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg">
                    <Mic size={16} />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
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
            // No messages state
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md px-4">
                <MessageCircle className="mx-auto mb-6 text-gray-300" size={80} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No conversation selected</h3>
                <p className="text-gray-500">
                  {contacts.length > 0 
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