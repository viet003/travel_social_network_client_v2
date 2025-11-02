import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const GroupMediaPage: React.FC = () => {
  const [activeMediaTab, setActiveMediaTab] = useState('photos');

  // Mock media data
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      author: 'Nguyễn Văn A',
      date: '2 giờ trước',
      likes: 45,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      author: 'Trần Thị B',
      date: '5 giờ trước',
      likes: 120,
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=400&fit=crop',
      author: 'Lê Văn C',
      date: '1 ngày trước',
      likes: 67,
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=400&fit=crop',
      author: 'Phạm Thị D',
      date: '2 ngày trước',
      likes: 89,
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      author: 'Hoàng Văn E',
      date: '3 ngày trước',
      likes: 34,
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      author: 'Vũ Thị F',
      date: '4 ngày trước',
      likes: 56,
    },
  ];

  const videos = [
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop',
      title: 'Du lịch Phú Quốc 2024',
      author: 'Nguyễn Văn A',
      duration: '5:30',
      views: 1234,
      date: '1 ngày trước',
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      title: 'Tips du lịch Đà Lạt',
      author: 'Trần Thị B',
      duration: '8:15',
      views: 2345,
      date: '2 ngày trước',
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Hành trình Hội An',
      author: 'Lê Văn C',
      duration: '10:45',
      views: 3456,
      date: '3 ngày trước',
    },
  ];

  const files = [
    {
      id: 1,
      name: 'Lịch trình du lịch Phú Quốc.pdf',
      type: 'PDF',
      size: '2.5 MB',
      author: 'Nguyễn Văn A',
      date: '2 giờ trước',
      downloads: 45,
    },
    {
      id: 2,
      name: 'Danh sách khách sạn Đà Lạt.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      author: 'Trần Thị B',
      date: '1 ngày trước',
      downloads: 78,
    },
    {
      id: 3,
      name: 'Bản đồ du lịch miền Tây.pdf',
      type: 'PDF',
      size: '3.2 MB',
      author: 'Lê Văn C',
      date: '2 ngày trước',
      downloads: 56,
    },
  ];

  const mediaTabs = [
    { id: 'photos', label: 'Ảnh', icon: 'fluent:image-24-filled', count: photos.length },
    { id: 'videos', label: 'Video', icon: 'fluent:video-24-filled', count: videos.length },
    { id: 'files', label: 'Tệp', icon: 'fluent:document-24-filled', count: files.length },
  ];

  return (
    <div className="space-y-4">
      {/* Media Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {mediaTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                activeMediaTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon icon={tab.icon} className="h-5 w-5" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeMediaTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      {activeMediaTab === 'photos' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <img
                src={photo.url}
                alt="Group photo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{photo.author}</p>
                  <div className="flex items-center justify-between text-white text-xs mt-1">
                    <span>{photo.date}</span>
                    <span className="flex items-center space-x-1">
                      <Icon icon="fluent:heart-24-filled" className="h-4 w-4" />
                      <span>{photo.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {activeMediaTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Icon icon="fluent:play-24-filled" className="h-8 w-8 text-blue-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.author}</span>
                  <span>{video.date}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                  <Icon icon="fluent:eye-24-regular" className="h-4 w-4" />
                  <span>{video.views.toLocaleString()} lượt xem</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files List */}
      {activeMediaTab === 'files' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      file.type === 'PDF' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Icon
                        icon={file.type === 'PDF' ? 'fluent:document-pdf-24-filled' : 'fluent:document-table-24-filled'}
                        className={`h-6 w-6 ${file.type === 'PDF' ? 'text-red-600' : 'text-green-600'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.author}</span>
                        <span>•</span>
                        <span>{file.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <Icon icon="fluent:arrow-download-24-regular" className="h-4 w-4" />
                        <span>{file.downloads} lượt tải</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-shrink-0">
                    Tải xuống
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMediaPage;
