import React, { useState } from 'react';
import { Users, Shield, Smartphone, Heart, Globe, MapPin, Monitor } from 'lucide-react';
import { Skeleton } from 'antd';

const PrivacyPage: React.FC = () => {
  const [imageLoading, setImageLoading] = useState({
    hero: true,
    chatAvatar: true,
    locationShare: true,
    contentControl: true,
    trust: true
  });

  const handleImageLoad = (imageKey: keyof typeof imageLoading) => {
    setImageLoading(prev => ({ ...prev, [imageKey]: false }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 text-center bg-travel-primary-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-gray-900 mb-4 sm:mb-6 text-left lg:text-center">
            <span className="text-[var(--travel-primary-500)]">Yên tâm </span> chia sẻ
            <br />
            từng khoảnh khắc
          </h1>
          <div className="mb-12">
            {imageLoading.hero ? (
              <Skeleton.Image 
                active 
                className="!w-full !h-64 sm:!h-72 md:!h-80 rounded-2xl"
              />
            ) : null}
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Friends traveling together"
              className={`w-full h-80 object-cover rounded-2xl mx-auto shadow-lg ${imageLoading.hero ? 'hidden' : 'block'}`}
              onLoad={() => handleImageLoad('hero')}
            />
          </div>
          <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
            Kết nối an toàn và bảo mật với
            cộng đồng mạng xã hội du lịch và những người
            bạn có cùng sở thích khám phá
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Shield className="w-12 h-12 text-[var(--travel-primary-500)] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Bảo mật tuyệt đối</h3>
            <p className="text-gray-600 text-sm">
              Thông tin cá nhân và nội dung chia sẻ được bảo vệ an toàn
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="w-12 h-12 text-[var(--travel-primary-500)] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Kết nối cộng đồng</h3>
            <p className="text-gray-600 text-sm">
              Tìm và kết nối với những người có cùng sở thích du lịch
            </p>
          </div>
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 text-[var(--travel-primary-500)] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Chia sẻ địa điểm</h3>
            <p className="text-gray-600 text-sm">
              Chia sẻ những địa điểm du lịch yêu thích một cách an toàn
            </p>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Bảo vệ cộng đồng mạng xã hội
            <br />
            du lịch của chúng tôi
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Chúng tôi xây dựng một môi trường an toàn và thân thiện để mọi người có thể
            chia sẻ những trải nghiệm du lịch một cách tự tin và bảo mật.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--travel-primary-50)] rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ngăn chặn hành vi gây hại</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Chúng tôi có các biện pháp bảo vệ để ngăn chặn spam, nội dung không phù hợp và các hành vi quấy rối trong cộng đồng mạng xã hội du lịch.
                </p>
              </div>
              <a href="#" className="text-[var(--travel-primary-500)] underline hover:text-[var(--travel-primary-600)] transition-colors cursor-pointer">
                Tìm hiểu thêm
              </a>
            </div>

            <div className="bg-[var(--travel-secondary-50)] rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Cung cấp cho bạn lựa chọn và quyền kiểm soát</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bạn có toàn quyền kiểm soát những gì chia sẻ, ai có thể xem nội dung của bạn và cách tương tác trong cộng đồng mạng xã hội du lịch.
                </p>
              </div>
              <a href="#" className="text-[var(--travel-primary-500)] underline hover:text-[var(--travel-primary-600)] transition-colors cursor-pointer">
                Tìm hiểu thêm
              </a>
            </div>

            <div className="bg-[var(--travel-primary-50)] rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Phản hồi tận tâm</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Chúng tôi có đội ngũ hỗ trợ chuyên nghiệp để xem xét và xử lý các báo cáo về nội dung không phù hợp. Chúng tôi thực thi <a href="#" className="text-[var(--travel-primary-500)] underline hover:text-[var(--travel-primary-600)] transition-colors cursor-pointer">Tiêu chuẩn cộng đồng</a> của mình và luôn sẵn sàng hỗ trợ bạn khi cần thiết.
                </p>
                <a href="#" className="text-[var(--travel-primary-500)] underline hover:text-[var(--travel-primary-600)] transition-colors cursor-pointer">
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Features */}
      <section className="py-8 sm:py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="bg-travel-primary-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {imageLoading.chatAvatar ? (
                      <Skeleton.Avatar active size={40} />
                    ) : null}
                    <img
                      src="https://i.pinimg.com/736x/66/82/08/668208d192e8f1940477efab820751fe.jpg"
                      alt="Việt Travel"
                      className={`w-10 h-10 rounded-full object-cover ${imageLoading.chatAvatar ? 'hidden' : 'block'}`}
                      onLoad={() => handleImageLoad('chatAvatar')}
                    />
                    <div>
                      <div className="font-medium">Việt Travel</div>
                      <div className="text-sm text-gray-500">Đang du lịch tại Hà Nội</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[var(--travel-primary-500)] text-white p-3 rounded-2xl rounded-br-md ml-auto max-w-xs">
                      Bạn có muốn tham gia chuyến đi Đà Lạt cuối tuần không?
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md max-w-xs">
                      Tuyệt! Mình rất muốn tham gia 😊
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Kết nối dễ dàng với
                <br />
                cộng đồng <span className="text-[var(--travel-primary-500)]">yêu thích du lịch</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Tìm kiếm và kết nối với những người có cùng sở thích du lịch,
                chia sẻ kinh nghiệm và tạo nên những mối quan hệ ý nghĩa.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              {imageLoading.locationShare ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!h-72 md:!h-80 rounded-2xl"
                />
              ) : null}
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Chia sẻ vị trí du lịch an toàn"
                className={`w-full h-80 object-cover rounded-2xl shadow-lg ${imageLoading.locationShare ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('locationShare')}
              />
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                <span className="text-[var(--travel-primary-500)]">Chia sẻ địa điểm</span> yêu thích
                <br />
                một cách an toàn
              </h3>
              <p className="text-gray-600 mb-6">
                Chia sẻ những địa điểm du lịch yêu thích và khám phá những nơi mới
                thông qua cộng đồng mạng xã hội du lịch một cách bảo mật.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Group Chat Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Kiểm soát <span className="text-[var(--travel-primary-500)]">hoàn toàn</span>
            <br />
            <span className="text-[var(--travel-primary-500)]">nội dung chia sẻ</span> của bạn
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Bạn có toàn quyền kiểm soát những gì chia sẻ trên mạng xã hội du lịch.
            Chọn nội dung, đối tượng xem và mức độ riêng tư phù hợp với bạn.
          </p>

          {imageLoading.contentControl ? (
            <Skeleton.Image 
              active 
              className="!w-full !h-80 sm:!h-96 md:!h-[400px] rounded-2xl"
            />
          ) : null}
          <img
            src="https://images.unsplash.com/photo-1646337005884-20d2c95fa786?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Kiểm soát nội dung chia sẻ"
            className={`w-full h-96 object-cover rounded-2xl shadow-lg ${imageLoading.contentControl ? 'hidden' : 'block'}`}
            onLoad={() => handleImageLoad('contentControl')}
          />
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12 sm:mb-16">
            <span className="text-[var(--travel-primary-500)]">Bảo mật là ưu tiên hàng đầu</span> của chúng tôi
          </h2>

          <p className="text-gray-600 mb-8">
            Chúng tôi tin rằng quyền riêng tư là một quyền cơ bản của con người.
            Vì vậy, chúng tôi đã xây dựng mạng xã hội du lịch với các công cụ bảo mật mạnh mẽ
            để bảo vệ thông tin cá nhân của bạn.
          </p>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="h-[300px] flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4 ">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <Shield className="w-8 h-8 text-[var(--travel-primary-500)] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Mã hóa dữ liệu</h4>
                  <p className="text-sm text-gray-600">Nội dung chia sẻ được bảo vệ an toàn</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <Globe className="w-8 h-8 text-[var(--travel-primary-500)] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Kiểm soát riêng tư</h4>
                  <p className="text-sm text-gray-600">Bạn quyết định ai có thể xem nội dung</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-8 h-[300px] hidden lg:grid">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-[200px]">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Được bảo vệ</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Nội dung của bạn</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Tất cả nội dung chia sẻ được bảo mật và chỉ những người bạn cho phép mới có thể xem được.
                </p>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-500">Được yêu thích bởi hàng triệu thành viên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Cam kết bảo vệ
            <br />
            cộng đồng mạng xã hội
            <br />
            du lịch của chúng tôi
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
            <div className="lg:w-1/2">
              {imageLoading.trust ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!h-72 md:!h-80 rounded-2xl"
                />
              ) : null}
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Travelers planning trip together"
                className={`w-full h-80 object-cover rounded-2xl shadow-lg ${imageLoading.trust ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('trust')}
              />
            </div>
            <div className="lg:w-1/2 text-left">
              <p className="text-gray-600 mb-6">
                Chúng tôi cam kết xây dựng một mạng xã hội du lịch an toàn và đáng tin cậy.
                Với đội ngũ phát triển chuyên nghiệp, chúng tôi không ngừng
                cải tiến để mang đến trải nghiệm kết nối tốt nhất cho cộng đồng.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--travel-secondary-500)] rounded-full"></div>
                  <span className="text-gray-700">Bảo mật đa lớp cho mạng xã hội</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--travel-secondary-500)] rounded-full"></div>
                  <span className="text-gray-700">Kiểm tra bảo mật định kỳ</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--travel-secondary-500)] rounded-full"></div>
                  <span className="text-gray-700">Hỗ trợ cộng đồng 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-8 sm:py-12 lg:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12 sm:mb-16">
            Công nghệ được sử dụng
          </h2>

          <div className="bg-travel-primary-50 rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Bảo mật tiên tiến</h3>
                <p className="text-gray-600 text-sm">
                  Sử dụng các công nghệ bảo mật mới nhất để đảm bảo an toàn cho mạng xã hội du lịch
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Mã hóa dữ liệu người dùng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Bảo vệ thông tin cá nhân</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Xác thực tài khoản an toàn</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Trải nghiệm mượt mà</h3>
                <p className="text-gray-600 text-sm">
                  Tối ưu hóa để mang lại trải nghiệm mạng xã hội du lịch mượt mà và nhanh chóng
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Chia sẻ nội dung tức thì</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Đồng bộ đa thiết bị</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Tối ưu hiệu suất</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Power Source */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 sm:mb-16">
            Tham gia cộng đồng mạng xã hội<br />
            du lịch ngay hôm nay
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
            <button className="bg-black text-white px-3 py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform flex-1">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs">Tải về từ</div>
                <div className="font-medium text-sm">App Store</div>
              </div>
            </button>

            <button className="bg-black text-white px-3 py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform flex-1">
              <Monitor className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Tải về từ</div>
                <div className="font-medium text-sm">Microsoft</div>
              </div>
            </button>

            <button className="bg-black text-white px-3 py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform flex-1">
              <Globe className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs">Truy cập</div>
                <div className="font-medium text-sm">Phiên bản Web</div>
              </div>
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
            <span>Khả dụng trên</span>
            <div className="flex items-center gap-4">
              <Smartphone className="w-6 h-6" />
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;