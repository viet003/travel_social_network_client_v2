import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const GroupMembersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Mock members data
  const members = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/60?img=10',
      role: 'Quản trị viên',
      joinedDate: '15/03/2023',
      postsCount: 234,
      isFriend: true,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/60?img=20',
      role: 'Người kiểm duyệt',
      joinedDate: '20/03/2023',
      postsCount: 189,
      isFriend: false,
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://i.pravatar.cc/60?img=30',
      role: 'Thành viên',
      joinedDate: '01/04/2023',
      postsCount: 56,
      isFriend: true,
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      avatar: 'https://i.pravatar.cc/60?img=40',
      role: 'Thành viên',
      joinedDate: '15/04/2023',
      postsCount: 42,
      isFriend: false,
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      avatar: 'https://i.pravatar.cc/60?img=50',
      role: 'Thành viên',
      joinedDate: '20/04/2023',
      postsCount: 38,
      isFriend: false,
    },
  ];

  const tabs = [
    { id: 'all', label: 'Tất cả', count: members.length },
    { id: 'friends', label: 'Bạn bè', count: members.filter(m => m.isFriend).length },
    { id: 'admins', label: 'Quản trị viên', count: members.filter(m => m.role !== 'Thành viên').length },
  ];

  const filteredMembers = members.filter(member => {
    if (filterTab === 'friends' && !member.isFriend) return false;
    if (filterTab === 'admins' && member.role === 'Thành viên') return false;
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Icon icon="fluent:search-24-regular" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{members.length}</div>
            <div className="text-sm text-gray-500">Tổng thành viên</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+12</div>
            <div className="text-sm text-gray-500">Hôm nay</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+89</div>
            <div className="text-sm text-gray-500">Tuần này</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">+234</div>
            <div className="text-sm text-gray-500">Tháng này</div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Danh sách thành viên ({filteredMembers.length})
        </h2>
        
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      member.role === 'Quản trị viên' 
                        ? 'bg-red-100 text-red-700'
                        : member.role === 'Người kiểm duyệt'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role}
                    </span>
                    {member.isFriend && (
                      <span className="flex items-center space-x-1 text-blue-600">
                        <Icon icon="fluent:people-24-filled" className="h-4 w-4" />
                        <span>Bạn bè</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <Icon icon="fluent:calendar-24-regular" className="h-3.5 w-3.5" />
                      <span>Tham gia {member.joinedDate}</span>
                    </span>
                    <span>•</span>
                    <span>{member.postsCount} bài viết</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!member.isFriend && member.role === 'Thành viên' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Kết bạn
                  </button>
                )}
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Icon icon="fluent:mail-24-regular" className="h-5 w-5" />
                </button>
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Icon icon="fluent:more-horizontal-24-filled" className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <Icon icon="fluent:people-search-24-regular" className="h-16 w-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy thành viên nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMembersPage;
