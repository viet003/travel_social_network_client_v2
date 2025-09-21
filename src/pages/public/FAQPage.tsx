import { useState } from 'react';
import { Search, Wrench, ArrowRight, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { featChat, featDiscover, featShare } from '../../assets/images';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  // Mock data for trending topics
  const trendingTopics = [
    "Cách tạo bài viết du lịch trên TravelNest",
    "Chia sẻ ảnh và video du lịch",
    "Tạo nhóm du lịch trên TravelNest",
    "Chặn người dùng trên TravelNest",
    "Không thể đăng bài trên TravelNest",
    "Bảo mật và quyền riêng tư trên TravelNest",
    "Xử lý khi bị quấy rối trên TravelNest"
  ];

  // Mock data for FAQs
  const faqs = [
    {
      id: 1,
      question: "Làm thế nào để tạo tài khoản TravelNest?",
      answer: "Bạn có thể tạo tài khoản TravelNest bằng cách nhấn vào nút 'Đăng ký' ở trang chủ, sau đó điền thông tin cá nhân và xác thực email của bạn."
    },
    {
      id: 2,
      question: "Tôi có thể đăng bài du lịch như thế nào?",
      answer: "Để đăng bài du lịch, hãy nhấn vào nút 'Tạo bài viết' ở trang chủ, sau đó thêm hình ảnh, mô tả về chuyến đi và vị trí của bạn. Bạn cũng có thể thêm hashtag để dễ dàng tìm kiếm."
    },
    {
      id: 3,
      question: "Làm sao để tìm bạn bè và kết nối trên TravelNest?",
      answer: "Bạn có thể tìm bạn bè bằng cách sử dụng tính năng tìm kiếm, nhập tên hoặc email của họ. TravelNest cũng gợi ý những người có thể quen biết dựa trên bạn bè chung."
    },
    {
      id: 4,
      question: "Tôi có thể tạo nhóm du lịch không?",
      answer: "Có! Bạn có thể tạo nhóm du lịch để lên kế hoạch chuyến đi cùng bạn bè. Vào 'Nhóm' > 'Tạo nhóm mới' và mời những người bạn muốn tham gia."
    },
    {
      id: 5,
      question: "Làm thế nào để báo cáo nội dung không phù hợp?",
      answer: "Để báo cáo nội dung không phù hợp, nhấn vào dấu '...' ở góc trên bên phải của bài viết, chọn 'Báo cáo' và làm theo hướng dẫn. Đội ngũ TravelNest sẽ xem xét và xử lý."
    },
    {
      id: 6,
      question: "Tôi có thể chia sẻ vị trí thực tế không?",
      answer: "Có, TravelNest cho phép bạn chia sẻ vị trí hiện tại hoặc vị trí của các địa điểm du lịch. Bạn có thể bật/tắt tính năng này trong cài đặt quyền riêng tư."
    },
    {
      id: 7,
      question: "Làm thế nào để xóa tài khoản TravelNest?",
      answer: "Để xóa tài khoản, vào 'Cài đặt' > 'Tài khoản' > 'Xóa tài khoản'. Lưu ý rằng hành động này không thể hoàn tác và tất cả dữ liệu sẽ bị xóa vĩnh viễn."
    }
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaqs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id)
        : [...prev, id]
    );
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="text-left mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--travel-primary-500)] mb-4 sm:mb-6">
            Chúng tôi có thể giúp gì cho bạn?
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-full mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết trợ giúp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-100 rounded-xl text-sm sm:text-base focus:outline-none focus:border-transparent"
            />
          </div>
        </div>

        {/* Login Help Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  Bạn cần trợ giúp đăng nhập?
                </h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  Tìm hiểu về những gì nên làm nếu bạn không vào lại được tài khoản TravelNest của mình.
                </p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors self-start sm:self-auto cursor-pointer">
              Nhận trợ giúp
            </button>
          </div>
        </div>

        {/* Trending Topics and FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Trending Topics */}
          <div className="lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Chủ đề thịnh hành
            </h2>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 hover:underline py-2 text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {topic}
                </a>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 sm:mt-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-gray-900 text-xs sm:text-sm">{faq.question}</span>
                      {expandedFaqs.includes(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaqs.includes(faq.id) && (
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - App Screenshots */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="relative">
              {/* Real app screenshots */}
              <div className="space-y-4 sm:space-y-6">
                {/* Chat Feature */}
                <div className="relative">
                  <img
                    src={featChat}
                    alt="TravelNest Chat Feature"
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 sm:px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-medium text-gray-700">TravelNest Chat</span>
                  </div>
                </div>

                {/* Discover Feature */}
                <div className="relative ml-4 sm:ml-8">
                  <img
                    src={featDiscover}
                    alt="TravelNest Discover Feature"
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 sm:px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-medium text-gray-700">Khám phá</span>
                  </div>
                </div>

                {/* Share Feature */}
                <div className="relative -ml-2 sm:-ml-4">
                  <img
                    src={featShare}
                    alt="TravelNest Share Feature"
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 sm:px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-medium text-gray-700">Chia sẻ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Help Center */}
        <div className="mt-12 sm:mt-16 cur">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Bạn đang tìm gì khác ư?
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Truy cập Trung tâm trợ giúp doanh nghiệp
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Tìm hiểu thêm về cách quảng bá dịch vụ du lịch và khách sạn của bạn trên TravelNest
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
