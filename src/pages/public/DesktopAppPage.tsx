import React, { useState } from 'react';
import { Monitor, Download, Video } from 'lucide-react';
import { Skeleton } from 'antd';
import { desktopScreenApp } from '../../assets/images';

const DesktopAppPage: React.FC = () => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Left Section - Text Content */}
            <div className="lg:w-1/2 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-[var(--travel-primary-500)] leading-tight">
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
              <div className="pt-2 sm:pt-4">
                <button className="bg-black text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center space-x-2 sm:space-x-3 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-medium">Tải về từ Microsoft</div>
                  </div>
                </button>
              </div>

              {/* Footer Text */}
              <p className="text-sm text-gray-500 max-w-md">
                Bạn cần cài đặt macOS 12 (Monterey) trở lên để dùng ứng dụng dành cho máy tính.
              </p>
            </div>

            {/* Right Section - Desktop App Screenshot */}
            <div className="lg:w-1/2 flex justify-center w-full">
              <div className="relative">
                {imageLoading ? (
                  <Skeleton.Image 
                    active 
                    className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-sm sm:max-w-md lg:max-w-2xl rounded-2xl"
                  />
                ) : null}
                <img
                  src={desktopScreenApp}
                  alt="TravelNest Desktop Application"
                  className={`w-full max-w-sm sm:max-w-md lg:max-w-2xl h-auto rounded-2xl ${imageLoading ? 'hidden' : 'block'}`}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[var(--travel-primary-500)]">
            Tại sao chọn ứng dụng dành cho máy tính?
          </h2>
          <p className="text-sm sm:text-md text-gray-600 mb-8 sm:mb-12">
            Trải nghiệm đầy đủ với giao diện rộng rãi và tính năng mạnh mẽ
          </p>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <Monitor className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Giao diện rộng rãi</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Tận dụng màn hình lớn để xem nhiều cuộc trò chuyện và chia sẻ hình ảnh du lịch cùng lúc
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <Download className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Đồng bộ hoàn hảo</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Dữ liệu được đồng bộ tự động giữa tất cả các thiết bị của bạn
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <Video className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Video call chất lượng cao</h3>
              <p className="text-sm sm:text-base text-gray-600">
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
