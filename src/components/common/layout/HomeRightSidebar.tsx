import React from 'react';
import { Icon } from '@iconify/react';
import { SimpleCalendar } from '../cards';

const RightSidebar: React.FC = () => {
  // Contact list
  const contacts = [
    { name: 'Meta AI', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', hasCheck: true, status: 'online' },
    { name: 'Dinh Hong Son', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', status: 'online' },
    { name: 'Phong Vũ', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', status: 'online' },
    { name: 'Nguyễn Đức Minh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', status: 'online' },
    { name: 'Huyền Nguyễn', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', status: 'offline' },
    { name: 'Mạnh Nguyễn', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face', lastSeen: '32 phút' },
    { name: 'Trần Trung Kiên', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', lastSeen: '37 phút' },
    { name: 'Thế Hiếu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', status: 'offline' },
    { name: 'Nguyễn Quang Hệ', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', lastSeen: '1 giờ' },
    { name: 'Văn Tuấn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', status: 'offline' },
  ];

  // Groups list
  const groups = [
    { name: 'Travel Enthusiasts', avatar: 'https://images.unsplash.com/photo-1488646950254-3d0d0e0a5aa9?w=40&h=40&fit=crop&crop=center', memberCount: '2.1k', isActive: true },
    { name: 'Food Lovers', avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=40&h=40&fit=crop&crop=center', memberCount: '1.8k', isActive: false },
    { name: 'Tech Community', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=40&h=40&fit=crop&crop=center', memberCount: '3.2k', isActive: false },
    { name: 'Photography Club', avatar: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=40&h=40&fit=crop&crop=center', memberCount: '1.5k', isActive: false },
    { name: 'Fitness Group', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=40&h=40&fit=crop&crop=center', memberCount: '2.7k', isActive: false },
    { name: 'Book Club', avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=40&h=40&fit=crop&crop=center', memberCount: '890', isActive: false },
    { name: 'Music Lovers', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop&crop=center', memberCount: '4.1k', isActive: false },
    { name: 'Gaming Squad', avatar: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=40&h=40&fit=crop&crop=center', memberCount: '2.3k', isActive: false }
  ];

  return (
    <div className="w-80 bg-white p-4 sticky top-0 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Calendar Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-4">Lịch</h3>
        <SimpleCalendar 
          events={{
            '2025-11-18': true,
            '2025-11-20': true,
            '2025-11-25': true,
          }}
          onDateClick={(date) => console.log(date.format('YYYY-MM-DD'))}
          eventColor="#1890ff"
        />
      </div>

      {/* Contacts Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Người liên hệ</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon icon="fluent:search-24-filled" className="w-5 h-5 text-black" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon icon="fluent:more-vertical-24-filled" className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-1">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-white font-semibold text-sm bg-blue-500 w-full h-full flex items-center justify-center">${contact.name.charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                {contact.status === 'online' && (
                  <div className="absolute -bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-black">{contact.name}</span>
                  {/* {contact.hasCheck && (
                    <span className="ml-1 text-blue-500 text-xs">✓</span>
                  )} */}
                </div>
                {contact.lastSeen && (
                  <span className="text-xs text-gray-500">{contact.lastSeen}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groups Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-black">Nhóm</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon icon="fluent:search-24-filled" className="w-5 h-5 text-black" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Icon icon="fluent:more-vertical-24-filled" className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-1">
          {groups.map((group, index) => (
            <div key={index} className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${group.isActive ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}>
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-white font-semibold text-xs bg-blue-500 w-full h-full flex items-center justify-center">${group.name.charAt(0)}</span>`;
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${group.isActive ? 'text-blue-600' : 'text-black'
                    }`}>
                    {group.name}
                  </span>
                  <span className="text-xs text-gray-500">{group.memberCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-4 right-4 w-12 h-12 bg-white hover:bg-gray-100 text-black shadow-lg hover:shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 z-50 cursor-pointer border border-gray-200">
        <Icon icon="fluent:magic-wand-16-filled" className="w-6 h-6 text-black" />
      </button>
    </div>
  );
};

export default RightSidebar;
