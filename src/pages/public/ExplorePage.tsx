import React from 'react';
import { Icon } from '@iconify/react';

const ExplorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Icon icon="fluent:globe-search-24-filled" className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Khám phá dành cho du lịch</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm điểm đến..."
                  className="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Icon icon="fluent:search-24-filled" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Destinations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Điểm đến nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Đà Nẵng', image: '🏖️', description: 'Thành phố biển xinh đẹp' },
              { name: 'Hội An', image: '🏮', description: 'Phố cổ lãng mạn' },
              { name: 'Sapa', image: '⛰️', description: 'Vùng núi hùng vĩ' },
              { name: 'Phú Quốc', image: '🏝️', description: 'Đảo ngọc xanh' },
              { name: 'Hạ Long', image: '🛥️', description: 'Vịnh di sản thế giới' },
              { name: 'Huế', image: '🏯', description: 'Kinh đô cố đô' }
            ].map((destination, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
                  {destination.image}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">Khám phá ngay</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Icon icon="fluent:star-24-filled" className="h-4 w-4 text-yellow-400" />
                      <span>4.{index + 5}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loại hình du lịch</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Du lịch biển', icon: 'fluent:beach-24-filled', color: 'text-blue-600' },
              { name: 'Du lịch núi', icon: 'fluent:mountain-24-filled', color: 'text-green-600' },
              { name: 'Du lịch văn hóa', icon: 'fluent:building-24-filled', color: 'text-purple-600' },
              { name: 'Du lịch ẩm thực', icon: 'fluent:food-24-filled', color: 'text-orange-600' },
              { name: 'Du lịch mạo hiểm', icon: 'fluent:rocket-24-filled', color: 'text-red-600' },
              { name: 'Du lịch nghỉ dưỡng', icon: 'fluent:spa-24-filled', color: 'text-pink-600' }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <Icon icon={category.icon} className={`h-8 w-8 ${category.color} mx-auto mb-2`} />
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mẹo du lịch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Chuẩn bị hành lý thông minh',
                content: 'Những món đồ cần thiết cho chuyến du lịch hoàn hảo',
                icon: 'fluent:luggage-24-filled'
              },
              {
                title: 'Tiết kiệm chi phí du lịch',
                content: 'Cách lập kế hoạch du lịch với ngân sách hợp lý',
                icon: 'fluent:money-24-filled'
              },
              {
                title: 'An toàn khi du lịch',
                content: 'Những lưu ý quan trọng để có chuyến đi an toàn',
                icon: 'fluent:shield-24-filled'
              },
              {
                title: 'Chụp ảnh du lịch đẹp',
                content: 'Bí quyết chụp ảnh để có những kỷ niệm tuyệt vời',
                icon: 'fluent:camera-24-filled'
              }
            ].map((tip, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon icon={tip.icon} className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Routes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tuyến đường phổ biến</h2>
          <div className="space-y-4">
            {[
              { route: 'Hà Nội → Sapa → Hạ Long', duration: '5 ngày', price: '2.5M VNĐ' },
              { route: 'TP.HCM → Đà Lạt → Nha Trang', duration: '4 ngày', price: '3M VNĐ' },
              { route: 'Đà Nẵng → Hội An → Huế', duration: '3 ngày', price: '2M VNĐ' },
              { route: 'Cần Thơ → Phú Quốc → Rạch Giá', duration: '4 ngày', price: '2.8M VNĐ' }
            ].map((route, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Icon icon="fluent:map-24-filled" className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{route.route}</h3>
                    <p className="text-sm text-gray-600">{route.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{route.price}</p>
                  <p className="text-sm text-gray-500">Từ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
