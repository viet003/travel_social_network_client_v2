import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import '../../../styles/swiper-custom.css';

// Real video data
const featuredVideos = [
  {
    id: 1,
    title: 'Khám phá Hạ Long - Kỳ quan thế giới',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    author: 'Travel Vietnam',
    views: '125K',
    time: '2 giờ trước'
  },
  {
    id: 2,
    title: 'Phố cổ Hội An về đêm',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    author: 'Discover Quang Nam',
    views: '89K',
    time: '5 giờ trước'
  },
  {
    id: 3,
    title: 'Đà Lạt - Thành phố ngàn hoa',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    author: 'Vietnam Adventures',
    views: '156K',
    time: '1 ngày trước'
  },
  {
    id: 4,
    title: 'Sapa mùa lúa chín vàng',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    author: 'Highland Journey',
    views: '203K',
    time: '1 ngày trước'
  },
  {
    id: 5,
    title: 'Phú Quốc - Đảo ngọc thiên đường',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    author: 'Beach Lovers',
    views: '178K',
    time: '2 ngày trước'
  },
  {
    id: 6,
    title: 'Ninh Bình - Vịnh Hạ Long trên cạn',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    author: 'Nature Explorer',
    views: '142K',
    time: '3 ngày trước'
  },
  {
    id: 7,
    title: 'Mũi Né - Bình Minh trên đồi cát',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    author: 'Desert Dreams',
    views: '98K',
    time: '4 ngày trước'
  },
  {
    id: 8,
    title: 'Cần Thơ - Chợ nổi miền Tây',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    author: 'Mekong Tales',
    views: '167K',
    time: '5 ngày trước'
  },
  {
    id: 9,
    title: 'Đảo Cát Bà - Thiên nhiên hoang sơ',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    author: 'Wild Vietnam',
    views: '134K',
    time: '1 tuần trước'
  }
];

const recentVideos = [
  {
    id: 1,
    title: 'Săn mây Tà Xùa - Trải nghiệm độc đáo',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    author: 'Mountain Explorer',
    views: '45K',
    time: '3 giờ trước',
    description: 'Hành trình săn mây tại Tà Xùa, Yên Bái'
  },
  {
    id: 2,
    title: 'Ẩm thực đường phố Sài Gòn',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    author: 'Food Hunter',
    views: '78K',
    time: '1 ngày trước',
    description: 'Khám phá những món ăn vỉa hè Sài Gòn'
  },
  {
    id: 3,
    title: 'Cù Lao Chàm - Thiên đường biển đảo',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    author: 'Island Paradise',
    views: '92K',
    time: '2 ngày trước',
    description: 'Tour khám phá Cù Lao Chàm tuyệt đẹp'
  },
  {
    id: 4,
    title: 'Trekking Fansipan - Nóc nhà Đông Dương',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    author: 'Peak Climbers',
    views: '112K',
    time: '3 ngày trước',
    description: 'Chinh phục đỉnh Fansipan 3143m'
  }
];

const WatchFeedPage: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Videos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Video nổi bật</h2>
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={3}
            slidesPerGroup={3}
            navigation={false}
            pagination={{ 
              clickable: true,
              dynamicBullets: false
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={false}
            breakpoints={{
              320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 24,
              },
            }}
            className="watch-feed-swiper"
          >
          {featuredVideos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
                    <Icon icon="fluent:play-circle-24-filled" className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.author}</span>
                    <span>{video.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {video.views} lượt xem
                  </div>
                </div>
              </div>
            </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          {!isBeginning && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-[40%] hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
            >
              <Icon icon="fluent:chevron-left-20-filled" className="w-5 h-5" />
            </button>
          )}

          {!isEnd && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-[40%] hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
            >
              <Icon icon="fluent:chevron-right-24-filled" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Videos */}
      <div className="px-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Video gần đây</h2>
        <div className="space-y-4">
          {recentVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm p-4 flex space-x-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-40 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
                  <Icon icon="fluent:play-circle-24-filled" className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{video.author}</span>
                  <span>•</span>
                  <span>{video.views} lượt xem</span>
                  <span>•</span>
                  <span>{video.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchFeedPage;
