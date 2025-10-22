import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const CustomListsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Mock data for custom lists
  const customLists = [
    {
      id: 1,
      name: "Bạn thân",
      icon: "fluent:heart-24-filled",
      color: "text-red-500",
      friendCount: 15
    },
    {
      id: 2,
      name: "Đồng nghiệp",
      icon: "fluent:briefcase-24-filled",
      color: "text-blue-500",
      friendCount: 32
    },
    {
      id: 3,
      name: "Gia đình",
      icon: "fluent:people-team-24-filled",
      color: "text-green-500",
      friendCount: 12
    },
    {
      id: 4,
      name: "Du lịch",
      icon: "fluent:airplane-24-filled",
      color: "text-purple-500",
      friendCount: 24
    },
    {
      id: 5,
      name: "Học cũ",
      icon: "fluent:book-24-filled",
      color: "text-yellow-500",
      friendCount: 18
    }
  ];

  const handleCreateList = () => {
    if (newListName.trim()) {
      // Handle create list logic here
      console.log('Creating list:', newListName);
      setNewListName('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Danh sách tùy chỉnh</h2>
            <p className="text-gray-600 text-sm">Sắp xếp bạn bè của bạn thành các danh sách tùy chỉnh</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
            style={{ backgroundColor: 'var(--travel-primary-500)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
          >
            <Icon icon="fluent:add-24-filled" className="h-5 w-5" />
            <span>Tạo danh sách</span>
          </button>
        </div>
      </div>

      {/* Custom Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customLists.map((list) => (
          <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center ${list.color}`}>
                <Icon icon={list.icon} className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 
                  className="text-gray-900 font-semibold text-lg transition-colors cursor-pointer"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {list.name}
                </h3>
                <p className="text-gray-600 text-sm">{list.friendCount} bạn bè</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Icon icon="fluent:more-vertical-24-regular" className="h-5 w-5" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
                Xem danh sách
              </button>
              <button className="bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
                <Icon icon="fluent:edit-24-regular" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {customLists.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="fluent:list-24-regular" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Bạn chưa có danh sách tùy chỉnh nào</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--travel-primary-500)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)'}
          >
            Tạo danh sách đầu tiên
          </button>
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Tạo danh sách mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Icon icon="fluent:dismiss-24-regular" className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Tên danh sách
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nhập tên danh sách"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--travel-primary-500)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 102, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = '';
                }}
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={!newListName.trim() ? {} : { backgroundColor: 'var(--travel-primary-500)' }}
                onMouseEnter={(e) => {
                  if (newListName.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newListName.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)';
                  }
                }}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomListsPage;
