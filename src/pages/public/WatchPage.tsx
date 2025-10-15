import React from 'react';
import { Icon } from '@iconify/react';

const WatchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Icon icon="fluent:play-24-filled" className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Watch</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Tạo video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Videos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Video nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <Icon icon="fluent:play-24-filled" className="h-12 w-12 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Video du lịch {item}</h3>
                  <p className="text-sm text-gray-600 mb-2">Khám phá những điểm đến tuyệt vời</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Người dùng {item}</span>
                    <span>2 giờ trước</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Du lịch', icon: 'fluent:globe-24-filled' },
              { name: 'Ẩm thực', icon: 'fluent:food-24-filled' },
              { name: 'Văn hóa', icon: 'fluent:building-24-filled' },
              { name: 'Thể thao', icon: 'fluent:sport-24-filled' },
              { name: 'Giải trí', icon: 'fluent:music-note-24-filled' },
              { name: 'Giáo dục', icon: 'fluent:book-24-filled' }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <Icon icon={category.icon} className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Video gần đây</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm p-4 flex space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon icon="fluent:play-24-filled" className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Video du lịch {item}</h3>
                  <p className="text-sm text-gray-600 mb-2">Mô tả ngắn về video du lịch thú vị</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Người dùng {item}</span>
                    <span>•</span>
                    <span>1.{item}k lượt xem</span>
                    <span>•</span>
                    <span>{item} ngày trước</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;