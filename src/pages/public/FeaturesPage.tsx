import { 
  MapPin, 
  Users, 
  Camera, 
  MessageCircle, 
  Heart, 
  Share2, 
  Shield, 
  Globe,
  Smartphone,
  Calendar,
  Star,
  Compass
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Khám phá địa điểm",
      description: "Tìm kiếm và khám phá những địa điểm du lịch tuyệt vời từ cộng đồng"
    },
    {
      icon: Users,
      title: "Kết nối bạn bè",
      description: "Kết bạn với những người cùng đam mê du lịch và chia sẻ kinh nghiệm"
    },
    {
      icon: Camera,
      title: "Chia sẻ ảnh",
      description: "Đăng tải và chia sẻ những bức ảnh đẹp từ chuyến đi của bạn"
    },
    {
      icon: MessageCircle,
      title: "Trò chuyện",
      description: "Chat trực tiếp với bạn bè và cộng đồng du lịch"
    },
    {
      icon: Heart,
      title: "Yêu thích",
      description: "Lưu lại những địa điểm và bài viết bạn yêu thích"
    },
    {
      icon: Share2,
      title: "Chia sẻ",
      description: "Chia sẻ chuyến đi và kinh nghiệm với mọi người"
    },
    {
      icon: Shield,
      title: "Bảo mật",
      description: "Thông tin cá nhân được bảo vệ an toàn và riêng tư"
    },
    {
      icon: Globe,
      title: "Toàn cầu",
      description: "Kết nối với du khách từ khắp nơi trên thế giới"
    },
    {
      icon: Smartphone,
      title: "Di động",
      description: "Ứng dụng tối ưu cho điện thoại và máy tính bảng"
    },
    {
      icon: Calendar,
      title: "Lập kế hoạch",
      description: "Tạo và quản lý lịch trình du lịch chi tiết"
    },
    {
      icon: Star,
      title: "Đánh giá",
      description: "Đánh giá và nhận xét về địa điểm và dịch vụ"
    },
    {
      icon: Compass,
      title: "Định vị",
      description: "Tìm kiếm địa điểm gần bạn và khám phá xung quanh"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-travel-primary-600 to-travel-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-[70px] font-bold mb-6">
            Tính năng nổi bật
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Khám phá tất cả những tính năng tuyệt vời giúp bạn có trải nghiệm du lịch hoàn hảo
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-travel-primary-500 to-travel-secondary-500 rounded-xl mb-6">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-travel-primary-600 to-travel-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cộng đồng du lịch lớn nhất và khám phá thế giới cùng chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-travel-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Tải ứng dụng ngay
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-travel-primary-600 transition-all duration-300 transform hover:scale-105">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
