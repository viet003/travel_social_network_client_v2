import { useState } from 'react';
import { Skeleton } from 'antd';
import { featChat, featDiscover, featSearch, featShare, featSuggest } from '../../assets/images';

const FeaturesPage = () => {
  const [imageLoading, setImageLoading] = useState({
    feat1: true,
    feat2: true,
    feat3: true,
    feat4: true,
    feat5: true
  });

  const handleImageLoad = (imageKey: keyof typeof imageLoading) => {
    setImageLoading(prev => ({ ...prev, [imageKey]: false }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* First Feature Section: Help. Connect. Express */}
      <div className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-5xl lg:text-6xl font-bold text-blue-600 mb-8 leading-tight">
                <div>Khám phá.</div>
                <div>Chia sẻ.</div>
                <div>Kết nối.</div>
              </h1>
              <p className="text-md text-gray-700 leading-relaxed max-w-2xl">
                Khám phá những điểm đến tuyệt vời, chia sẻ trải nghiệm du lịch của bạn, kết nối với cộng đồng du lịch và tạo ra những kỷ niệm đáng nhớ - tất cả trong một mạng xã hội du lịch.
              </p>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              {imageLoading.feat1 ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl"
                />
              ) : null}
              <img
                src={featChat}
                alt="Feature 1 - Explore, Share, Connect"
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl ${imageLoading.feat1 ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('feat1')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Feature Section: Reach anyone, anywhere */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">CHAT VÀ GỌI ĐIỆN</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                <div>Kết nối với mọi người,</div>
                <div>ở bất cứ đâu</div>
              </h2>
              <p className="text-md text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Tìm và kết nối với những người bạn du lịch, chia sẻ kinh nghiệm và lập kế hoạch chuyến đi cùng nhau.
              </p>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              {imageLoading.feat2 ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl"
                />
              ) : null}
              <img
                src={featShare}
                alt="Feature 2 - Connect with travelers"
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl ${imageLoading.feat2 ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('feat2')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Third Feature Section: Get expert travel advice */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
              {imageLoading.feat3 ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl"
                />
              ) : null}
              <img
                src={featSuggest}
                alt="Feature 3 - Travel Expert Consultation"
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl ${imageLoading.feat3 ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('feat3')}
              />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">TƯ VẤN DU LỊCH</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                <div>Nhận gợi ý du lịch</div>
                <div>từ mọi người</div>
              </h2>
              <p className="text-md text-gray-700 leading-relaxed max-w-2xl mb-4">
                Kết nối với cộng đồng để nhận tư vấn, gợi ý địa điểm, lập kế hoạch chuyến đi và khám phá những điểm đến mới.
              </p>
              <p className="text-sm text-gray-500">
                *Cộng đồng du lịch luôn sẵn sàng chia sẻ kinh nghiệm và hỗ trợ bạn lập kế hoạch chuyến đi hoàn hảo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Feature Section: Create content and connect */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">CHIA SẺ VÀ KẾT NỐI</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                <div>Chia sẻ trải nghiệm</div>
                <div>và kết nối</div>
              </h2>
              <p className="text-md text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Chia sẻ những trải nghiệm du lịch tuyệt vời, tạo nội dung về chuyến đi và kết nối với cộng đồng du lịch để cùng khám phá thế giới.
              </p>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              {imageLoading.feat4 ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl"
                />
              ) : null}
              <img
                src={featSearch}
                alt="Feature 4 - Share experiences and connect"
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl ${imageLoading.feat4 ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('feat4')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fifth Feature Section: Search and discover */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
              {imageLoading.feat5 ? (
                <Skeleton.Image 
                  active 
                  className="!w-full !h-64 sm:!w-full sm:!h-80 md:!w-full md:!h-96 lg:!w-full lg:!h-[400px] max-w-md sm:max-w-lg lg:max-w-2xl rounded-2xl"
                />
              ) : null}
              <img
                src={featDiscover}
                alt="Feature 5 - Search and discover"
                className={`w-full max-w-md sm:max-w-lg lg:max-w-2xl h-auto rounded-2xl ${imageLoading.feat5 ? 'hidden' : 'block'}`}
                onLoad={() => handleImageLoad('feat5')}
              />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">TÌM KIẾM VÀ KHÁM PHÁ</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                <div>Tìm kiếm và</div>
                <div>khám phá</div>
              </h2>
              <p className="text-md text-gray-700 leading-relaxed max-w-2xl mb-4">
                Tìm kiếm địa điểm du lịch, khách sạn, nhà hàng và kết nối với du khách khác. Khám phá những điểm đến mới và lập kế hoạch chuyến đi hoàn hảo.
              </p>
              <p className="text-sm text-gray-500">
                Tìm kiếm thông minh giúp bạn khám phá những địa điểm phù hợp với sở thích và ngân sách du lịch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
