import { Icon } from "@iconify/react";

const UserItinerariesPage = () => {
  const itineraries = [
    {
      title: "Lịch trình 5 ngày 4 đêm khám phá miền Bắc",
      destinations: ["Hà Nội", "Hạ Long", "Sapa"],
      days: 5,
      budget: "8.000.000 VNĐ",
      date: "Tháng 12/2024",
      likes: 156,
      saves: 89,
      image: "🗺️",
      status: "published",
      description: "Hành trình khám phá trọn vẹn vẻ đẹp miền Bắc với các địa điểm nổi tiếng và trải nghiệm văn hóa đặc sắc."
    },
    {
      title: "Tour du lịch biển Phú Quốc 3 ngày 2 đêm",
      destinations: ["Phú Quốc"],
      days: 3,
      budget: "5.000.000 VNĐ",
      date: "Tháng 1/2025",
      likes: 234,
      saves: 145,
      image: "🏝️",
      status: "published",
      description: "Nghỉ dưỡng tại đảo ngọc với các hoạt động lặn biển, tham quan vườn tiêu và thưởng thức hải sản tươi ngon."
    },
    {
      title: "Khám phá miền Trung 7 ngày",
      destinations: ["Đà Nẵng", "Hội An", "Huế", "Quảng Bình"],
      days: 7,
      budget: "10.000.000 VNĐ",
      date: "Tháng 2/2025",
      likes: 98,
      saves: 67,
      image: "🏮",
      status: "draft",
      description: "Hành trình dọc miền Trung khám phá di sản văn hóa thế giới, ẩm thực đặc sắc và phong cảnh thiên nhiên tuyệt đẹp."
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:map-24-filled" className="w-10 h-10 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch trình của bạn</h1>
              <p className="text-gray-600 text-sm">
                Quản lý và lên kế hoạch cho các chuyến du lịch
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Icon icon="fluent:add-24-filled" className="h-5 w-5" />
            <span className="text-sm font-medium">Tạo lịch trình</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {itineraries.map((itinerary, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image Section */}
              <div className="w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-6xl flex-shrink-0">
                {itinerary.image}
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                    {itinerary.title}
                  </h3>
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                    itinerary.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {itinerary.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3">
                  {itinerary.description}
                </p>
                
                {/* Itinerary Details */}
                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-lg">
                    <Icon icon="fluent:calendar-24-filled" className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">{itinerary.days} ngày</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-lg">
                    <Icon icon="fluent:money-24-filled" className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">{itinerary.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-lg">
                    <Icon icon="fluent:location-24-filled" className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-gray-700">{itinerary.destinations.length} điểm đến</span>
                  </div>
                </div>
                
                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Icon
                        icon="fluent:heart-24-filled"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-red-500"
                      />
                      <span className="text-xs sm:text-sm font-medium">
                        {itinerary.likes}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Icon
                        icon="fluent:bookmark-24-filled"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                      />
                      <span className="text-xs sm:text-sm font-medium">
                        {itinerary.saves}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{itinerary.date}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Icon
                        icon="fluent:edit-24-filled"
                        className="h-5 w-5 text-gray-600"
                      />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Icon
                        icon="fluent:delete-24-filled"
                        className="h-5 w-5 text-red-600"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserItinerariesPage;
