import React from 'react';
import { Icon } from '@iconify/react';

const FriendsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon icon="fluent:people-24-filled" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bạn bè</h1>
              <p className="text-gray-600">Kết nối và chia sẻ với những người bạn du lịch</p>
            </div>
          </div>
        </div>

        {/* Friends Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon icon="fluent:people-24-filled" className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bạn bè</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon icon="fluent:people-community-24-filled" className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhóm chung</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon icon="fluent:location-24-filled" className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chuyến đi chung</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách bạn bè</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Friend Card */}
              {[1, 2, 3, 4, 5, 6].map((friend) => (
                <div key={friend} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + friend * 100000}?w=40&h=40&fit=crop&crop=face`}
                      alt={`Friend ${friend}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Nguyễn Văn {friend}</h3>
                      <p className="text-sm text-gray-600">Đang hoạt động</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Nhắn tin
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                      Xem trang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Find Friends */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tìm bạn bè</h2>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm bạn bè..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
