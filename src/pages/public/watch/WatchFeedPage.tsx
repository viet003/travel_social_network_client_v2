import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import WatchModal from '../../../components/modal/watch/WatchModal';
import { VideoThumbnailCard } from '../../../components/common/cards';
import type { WatchResponse } from '../../../types/video.types';
import '../../../styles/swiper-custom.css';

// Featured videos data (for carousel)
const featuredVideos = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Khám phá Hạ Long - Kỳ quan thế giới',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    author: 'Travel Vietnam',
    views: '125K',
    time: '2 giờ trước'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Phố cổ Hội An về đêm',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    author: 'Discover Quang Nam',
    views: '89K',
    time: '5 giờ trước'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Đà Lạt - Thành phố ngàn hoa',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800',
    author: 'Vietnam Adventures',
    views: '156K',
    time: '1 ngày trước'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Sapa mùa lúa chín vàng',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=800',
    author: 'Highland Journey',
    views: '203K',
    time: '1 ngày trước'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Phú Quốc - Đảo ngọc thiên đường',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800',
    author: 'Beach Lovers',
    views: '178K',
    time: '2 ngày trước'
  }
];

// Recent videos data matching WatchResponse interface
const recentVideos: WatchResponse[] = [
  {
    watchId: '550e8400-e29b-41d4-a716-446655440101',
    user: {
      userId: 'user-uuid-456',
      userName: 'Mountain Explorer',
      avatarImg: 'https://i.pravatar.cc/150?img=3'
    },
    title: 'Săn mây Tà Xùa - Trải nghiệm độc đáo',
    description: 'Hành trình săn mây tại Tà Xùa, Yên Bái. Cảnh quan thiên nhiên hùng vĩ và biển mây mờ ảo tạo nên trải nghiệm khó quên.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    duration: 480,
    location: 'Tà Xùa, Yên Bái',
    privacy: 'PUBLIC',
    likeCount: 1250,
    commentCount: 89,
    shareCount: 34,
    viewCount: 45000,
    createdAt: '2024-01-18T08:00:00Z',
    tags: ['trekking', 'mountain', 'cloud', 'adventure'],
    liked: false,
    watched: false
  },
  {
    watchId: '550e8400-e29b-41d4-a716-446655440102',
    user: {
      userId: 'user-uuid-789',
      userName: 'Food Hunter',
      avatarImg: 'https://i.pravatar.cc/150?img=5'
    },
    title: 'Ẩm thực đường phố Sài Gòn',
    description: 'Khám phá những món ăn vỉa hè Sài Gòn đặc sắc. Từ bánh mì, phở, đến hủ tiếu - tất cả đều có tại đây!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    duration: 600,
    location: 'TP. Hồ Chí Minh',
    privacy: 'PUBLIC',
    likeCount: 2340,
    commentCount: 156,
    shareCount: 67,
    viewCount: 78000,
    createdAt: '2024-01-17T14:30:00Z',
    tags: ['food', 'saigon', 'streetfood', 'vietnamese'],
    liked: true,
    watched: false
  },
  {
    watchId: '550e8400-e29b-41d4-a716-446655440103',
    user: {
      userId: 'user-uuid-321',
      userName: 'Island Paradise',
      avatarImg: 'https://i.pravatar.cc/150?img=7'
    },
    title: 'Cù Lao Chàm - Thiên đường biển đảo',
    description: 'Tour khám phá Cù Lao Chàm tuyệt đẹp. Biển xanh, cát trắng và không khí trong lành của đảo ngọc Quảng Nam.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 720,
    location: 'Cù Lao Chàm, Quảng Nam',
    privacy: 'PUBLIC',
    likeCount: 3100,
    commentCount: 201,
    shareCount: 89,
    viewCount: 92000,
    createdAt: '2024-01-16T10:15:00Z',
    tags: ['island', 'beach', 'travel', 'culao cham'],
    liked: false,
    watched: false
  },
  {
    watchId: '550e8400-e29b-41d4-a716-446655440104',
    user: {
      userId: 'user-uuid-654',
      userName: 'Peak Climbers',
      avatarImg: 'https://i.pravatar.cc/150?img=9'
    },
    title: 'Trekking Fansipan - Nóc nhà Đông Dương',
    description: 'Chinh phục đỉnh Fansipan 3143m - nóc nhà Đông Dương. Hành trình đầy thử thách nhưng vô cùng ý nghĩa.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 900,
    location: 'Fansipan, Lào Cai',
    privacy: 'PUBLIC',
    likeCount: 4200,
    commentCount: 287,
    shareCount: 123,
    viewCount: 112000,
    createdAt: '2024-01-15T06:00:00Z',
    tags: ['fansipan', 'trekking', 'mountain', 'sapa'],
    liked: true,
    watched: false
  }
];

const WatchFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = React.useState(true);
  const [isEnd, setIsEnd] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:play-circle-24-filled" className="w-10 h-10 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video Feed</h1>
              <p className="text-gray-600 text-sm">
                Khám phá các video mới và thịnh hành
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/home/watch/trending')}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Icon icon="fluent:fire-24-filled" className="w-4 h-4" />
            Video thịnh hành
          </button>
        </div>
      </div>

      {/* Featured Videos */}
      <div className="mb-8">
        <div className="border-l-4 border-gray-900 pl-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Video nổi bật</h2>
          <p className="text-gray-600 text-sm">
            Những video được chọn lọc và đề xuất đặc biệt
          </p>
        </div>
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
              <VideoThumbnailCard
                id={video.id}
                title={video.title}
                videoUrl={video.videoUrl}
                author={video.author}
                views={video.views}
                time={video.time}
                onClick={() => navigate(`/home/watch/${video.id}`)}
              />
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
      <div>
        <div className="border-l-4 border-gray-900 pl-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Video gần đây</h2>
          <p className="text-gray-600 text-sm">
            Video mới được đăng tải từ cộng đồng
          </p>
        </div>
        <div className="space-y-6">
          {recentVideos.map((video) => (
            <WatchModal
              key={video.watchId}
              videoId={video.watchId}
              userId={video.user.userId}
              avatar={video.user.avatarImg}
              userName={video.user.userName || video.user.fullName || 'Unknown User'}
              location={video.location}
              timeAgo={video.createdAt}
              content={video.description || ''}
              videoUrl={video.videoUrl}
              thumbnailUrl={video.thumbnailUrl}
              likeCount={video.likeCount}
              commentCount={video.commentCount}
              shareCount={video.shareCount}
              tags={video.tags}
              privacy={video.privacy}
              liked={video.liked}
              onShare={() => console.log('Share video', video.watchId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchFeedPage;
