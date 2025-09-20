import React from 'react';
import { Monitor, Download, Video } from 'lucide-react';
import desktopscreenapp from '../../assets/images/desktopscreenapp.png';

const DesktopAppPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Section - Text Content */}
            <div className="lg:w-1/2 space-y-8">
              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-[70px] font-bold text-[var(--travel-primary-500)] leading-tight">
                  "Kết nối" với
                  <br />
                  <span className="text-travel-primary-600">TravelNest</span>
                </h1>
              </div>

              {/* Body Text */}
              <p className="text-md text-gray-600 leading-relaxed max-w-lg">
                Ứng dụng đơn giản để kết nối, chia sẻ trải nghiệm du lịch và giữ liên lạc với những người mà bạn quan tâm. Dành cho máy tính và máy Mac.
              </p>

              {/* Download Button */}
              <div className="pt-4">
                <button className="bg-black text-white px-6 py-4 rounded-xl flex items-center space-x-3 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
                  <Monitor className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Tải về từ Microsoft</div>
                  </div>
                </button>
              </div>

              {/* Footer Text */}
              <p className="text-sm text-gray-500 max-w-md">
                Bạn cần cài đặt macOS 12 (Monterey) trở lên để dùng ứng dụng dành cho máy tính.
              </p>
            </div>

            {/* Right Section - Desktop App Screenshot */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src={desktopscreenapp}
                  alt="TravelNest Desktop Application"
                  className="w-full max-w-2xl h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-[var(--travel-primary-500)]">
            Tại sao chọn ứng dụng dành cho máy tính?
          </h2>
          <p className="text-md text-gray-600 mb-12">
            Trải nghiệm đầy đủ với giao diện rộng rãi và tính năng mạnh mẽ
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Monitor className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Giao diện rộng rãi</h3>
              <p className="text-gray-600">
                Tận dụng màn hình lớn để xem nhiều cuộc trò chuyện và chia sẻ hình ảnh du lịch cùng lúc
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Download className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Đồng bộ hoàn hảo</h3>
              <p className="text-gray-600">
                Dữ liệu được đồng bộ tự động giữa tất cả các thiết bị của bạn
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Video className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video call chất lượng cao</h3>
              <p className="text-gray-600">
                Tham gia video call với chất lượng HD để chia sẻ trải nghiệm du lịch sống động
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesktopAppPage;
