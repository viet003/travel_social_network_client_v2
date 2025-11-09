import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

// Mock data for user's videos
const myVideos = [
  {
    id: 1,
    title: 'Chuyến đi Đà Lạt mùa hoa dã quỳ',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    views: '1.2K',
    likes: 245,
    comments: 32,
    uploadTime: '2 ngày trước',
    duration: '8:45',
    status: 'published'
  },
  {
    id: 2,
    title: 'Khám phá ẩm thực Hội An',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    views: '890',
    likes: 156,
    comments: 18,
    uploadTime: '5 ngày trước',
    duration: '12:30',
    status: 'published'
  },
  {
    id: 3,
    title: 'Trekking Tà Xùa săn mây',
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    views: '2.5K',
    likes: 478,
    comments: 54,
    uploadTime: '1 tuần trước',
    duration: '15:20',
    status: 'published'
  },
  {
    id: 4,
    title: 'Video đang chỉnh sửa...',
    videoUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    views: '0',
    likes: 0,
    comments: 0,
    uploadTime: 'Đang chỉnh sửa',
    duration: '0:00',
    status: 'draft'
  }
];

const MyVideosPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredVideos = myVideos.filter(video => {
    if (filterStatus === 'all') return true;
    return video.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <Icon icon="fluent:arrow-left-24-filled" className="h-5 w-5" />
          <span>Quay lại Watch</span>
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Video của tôi</h1>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterStatus === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tất cả ({myVideos.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterStatus === 'published'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Đã đăng ({myVideos.filter(v => v.status === 'published').length})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterStatus === 'draft'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nháp ({myVideos.filter(v => v.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Icon icon="fluent:video-24-filled" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Tổng video</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{myVideos.filter(v => v.status === 'published').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <Icon icon="fluent:eye-24-filled" className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Lượt xem</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">4.6K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
              <Icon icon="fluent:heart-24-filled" className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Lượt thích</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">879</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <Icon icon="fluent:comment-24-filled" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Bình luận</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">104</p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all cursor-pointer">
                <Icon icon="fluent:play-circle-24-filled" className="h-16 w-16 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              {video.status === 'draft' && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Nháp
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Icon icon="fluent:eye-24-regular" className="h-4 w-4" />
                    <span>{video.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon icon="fluent:heart-24-regular" className="h-4 w-4" />
                    <span>{video.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon icon="fluent:comment-24-regular" className="h-4 w-4" />
                    <span>{video.comments}</span>
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">{video.uploadTime}</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center space-x-1 cursor-pointer">
                  <Icon icon="fluent:edit-24-regular" className="h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center space-x-1 cursor-pointer">
                  <Icon icon="fluent:share-24-regular" className="h-4 w-4" />
                  <span>Chia sẻ</span>
                </button>
                <button className="px-3 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                  <Icon icon="fluent:delete-24-regular" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVideosPage