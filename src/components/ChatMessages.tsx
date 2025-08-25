import React from 'react';
import { MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface ChatMessagesProps {
  selectedContact: string;
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ selectedContact, messages }) => {
  // Get contact info based on selected contact
  const getContactInfo = (contactId: string) => {
    const contactMap: { [key: string]: { name: string; color: string; avatar: string } } = {
      'dribbble': { name: 'Dribbble Team', color: 'bg-pink-500', avatar: '🎨' },
      'fireart': { name: 'Fireart Studio', color: 'bg-red-500', avatar: 'F' },
      'ivan': { name: 'Ivan Racitic', color: 'bg-gray-600', avatar: '👤' },
      'mario': { name: 'Mario Manjakic', color: 'bg-gray-600', avatar: '👤' },
      'uxstudio': { name: 'UX Studio', color: 'bg-yellow-500', avatar: 'U' },
      'team18': { name: 'Team U18', color: 'bg-gray-600', avatar: '👥' },
      'droilab': { name: 'Droilab', color: 'bg-orange-500', avatar: 'D' },
      'uplabs': { name: 'Team Uplabs', color: 'bg-purple-500', avatar: 'U' },
      'axel': { name: 'Axel Yixel Dorman', color: 'bg-gray-600', avatar: '👤' },
      'jordan': { name: 'Jordan Lukako', color: 'bg-gray-600', avatar: '👤' }
    };
    return contactMap[contactId] || { name: 'Unknown', color: 'bg-gray-500', avatar: '?' };
  };

  const contactInfo = getContactInfo(selectedContact);

  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 ${contactInfo.color} rounded-full flex items-center justify-center text-white font-bold text-base transition-transform duration-200 hover:scale-110`}>
              {contactInfo.avatar}
            </div>
            <h2 className="text-base font-semibold text-gray-900">{contactInfo.name}</h2>
          </div>
          <div className="flex gap-1.5">
            <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded cursor-pointer transition-all duration-200 hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded cursor-pointer transition-all duration-200 hover:bg-gray-100">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Message Tabs */}
      <div className="bg-white border-b border-gray-200 px-3 flex-shrink-0">
        <div className="flex space-x-6">
          <button className="py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 cursor-pointer transition-all duration-200 hover:text-blue-700">
            All Messages
          </button>
          <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200 hover:border-b-2 hover:border-gray-300">
            Archive
          </button>
          <button className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-200 hover:border-b-2 hover:border-gray-300">
            Deleted
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-2' : 'order-1'}`}>
              {!msg.isOwn && (
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 ${contactInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform duration-200 hover:scale-110`}>
                    {contactInfo.avatar}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{msg.sender}</span>
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-xl text-sm leading-relaxed transition-all duration-200 ${
                  msg.isOwn
                    ? 'bg-blue-500 text-white rounded-br-sm hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm hover:bg-gray-200'
                }`}
              >
                <p>{msg.content}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-sm text-gray-500">{msg.time}</span>
                <button className="text-gray-400 hover:text-gray-600 cursor-pointer transition-all duration-200 hover:scale-110">
                  <MoreVertical size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatMessages;
