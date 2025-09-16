import { 
  Zap, 
  Shield, 
  Monitor, 
  Code, 
  HelpCircle,
  Globe,
  Users,
  Camera,
  MapPin,
  Heart,
  Star
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Users,
      title: "Kết nối cộng đồng",
      description: "Gặp gỡ và kết nối với những người cùng đam mê du lịch từ khắp nơi trên thế giới."
    },
    {
      icon: Camera,
      title: "Chia sẻ trải nghiệm",
      description: "Chia sẻ những khoảnh khắc đẹp nhất trong chuyến đi của bạn qua ảnh và video."
    },
    {
      icon: MapPin,
      title: "Khám phá địa điểm",
      description: "Tìm hiểu về những điểm đến mới lạ và được gợi ý từ cộng đồng du lịch."
    },
    {
      icon: Heart,
      title: "Tạo kỷ niệm",
      description: "Lưu giữ và chia sẻ những kỷ niệm đáng nhớ từ mỗi chuyến phiêu lưu."
    },
    {
      icon: Star,
      title: "Đánh giá & Review",
      description: "Đánh giá và chia sẻ trải nghiệm thực tế về các điểm đến, dịch vụ du lịch."
    },
    {
      icon: Globe,
      title: "Du lịch bền vững",
      description: "Khuyến khích du lịch có trách nhiệm và bảo vệ môi trường."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Quyền riêng tư và an toàn",
      description: "Chúng tôi cam kết bảo vệ thông tin cá nhân và tạo môi trường an toàn cho cộng đồng."
    },
    {
      icon: Monitor,
      title: "Ứng dụng đa nền tảng",
      description: "Truy cập TravelNest trên mọi thiết bị - web, mobile app, desktop app."
    },
    {
      icon: Code,
      title: "Dành cho nhà phát triển",
      description: "API mở và tài liệu đầy đủ cho các nhà phát triển muốn tích hợp với TravelNest."
    },
    {
      icon: HelpCircle,
      title: "Trung tâm trợ giúp",
      description: "Hỗ trợ 24/7 và tài liệu hướng dẫn chi tiết để bạn có trải nghiệm tốt nhất."
    }
  ];

  return (
    <div className="space-y-12 lg:space-y-16 w-full">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-travel-gradient leading-tight">
          Về TravelNest
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
          Nền tảng mạng xã hội du lịch kết nối những người đam mê khám phá, 
          chia sẻ trải nghiệm và tạo ra những kỷ niệm không thể quên.
        </p>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-travel-gradient rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
          Cam kết của chúng tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-travel-primary-50 to-travel-secondary-50 rounded-2xl p-6 border border-travel-primary-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-travel-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-travel-primary-600 to-travel-secondary-600 rounded-3xl p-8 lg:p-12 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-lg sm:text-xl opacity-90 leading-relaxed">
            Tạo ra một cộng đồng du lịch toàn cầu nơi mọi người có thể kết nối, 
            chia sẻ và học hỏi lẫn nhau. Chúng tôi tin rằng du lịch không chỉ là 
            khám phá những vùng đất mới mà còn là cơ hội để mở rộng tầm nhìn và 
            kết nối với con người.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { number: "10K+", label: "Thành viên" },
          { number: "50K+", label: "Bài viết" },
          { number: "100+", label: "Quốc gia" },
          { number: "24/7", label: "Hỗ trợ" }
        ].map((stat, index) => (
          <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl lg:text-4xl font-bold text-travel-gradient mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 text-sm font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Tham gia cộng đồng TravelNest ngay hôm nay!
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Hãy cùng chúng tôi xây dựng một cộng đồng du lịch sôi động và đầy cảm hứng.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
