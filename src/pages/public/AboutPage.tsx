import {
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

  return (
    <div className="space-y-12 lg:space-y-16 w-full">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-[70px] font-bold text-[var(--travel-primary-500)] leading-tight">
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
                <div className="w-12 h-12 bg-travel-primary-500 rounded-xl flex items-center justify-center mb-4">
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
    </div>
  );
};

export default AboutPage;
