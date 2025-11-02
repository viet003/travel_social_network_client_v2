import React from 'react';
import { Icon } from '@iconify/react';

const GroupDiscussionPage: React.FC = () => {
  // Mock posts data
  const posts = [
    {
      id: 1,
      author: {
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/50?img=10',
        role: 'Thành viên'
      },
      content: 'Chào mọi người! Có ai có kinh nghiệm du lịch Phú Quốc tự túc không? Mình đang cần tư vấn về lịch trình và chỗ ở.',
      likes: 45,
      comments: 12,
      shares: 3,
      timestamp: '2 giờ trước'
    },
    {
      id: 2,
      author: {
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/50?img=20',
        role: 'Thành viên'
      },
      content: 'Chia sẻ một số tips tiết kiệm khi đi du lịch Đà Lạt nhé các bạn! 🌸',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      likes: 120,
      comments: 34,
      shares: 15,
      timestamp: '5 giờ trước'
    },
    {
      id: 3,
      author: {
        name: 'Lê Văn C',
        avatar: 'https://i.pravatar.cc/50?img=30',
        role: 'Thành viên'
      },
      content: 'Mình vừa về từ Hội An. Cảnh đẹp quá! Ai muốn đi thì inbox mình nhé, mình có thể tư vấn!',
      likes: 67,
      comments: 23,
      shares: 8,
      timestamp: '1 ngày trước'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-3">
          <img
            src="https://i.pravatar.cc/40?img=30"
            alt="Current user"
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={() => {/* Open post modal */}}
            className="flex-1 text-left px-4 py-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
          >
            Bạn viết gì đi...
          </button>
        </div>
        
        <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-200">
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon icon="fluent:image-24-filled" className="h-5 w-5 text-green-600" />
            <span className="text-gray-700 text-sm font-medium">Ảnh/Video</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon icon="fluent:emoji-24-filled" className="h-5 w-5 text-yellow-600" />
            <span className="text-gray-700 text-sm font-medium">Cảm xúc</span>
          </button>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Icon icon="fluent:filter-24-filled" className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Lọc bài viết:</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
              Tất cả
            </button>
            <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Mới nhất
            </button>
            <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Phổ biến
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{post.timestamp}</span>
                    <span>•</span>
                    <span>{post.author.role}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon icon="fluent:more-horizontal-24-filled" className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full rounded-lg mb-4"
              />
            )}

            {/* Post Stats */}
            <div className="flex items-center justify-between py-3 border-y border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Icon icon="fluent:thumb-like-24-filled" className="h-5 w-5 text-blue-600" />
                  <span>{post.likes}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{post.comments} bình luận</span>
                <span>{post.shares} chia sẻ</span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-around pt-3">
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon icon="fluent:thumb-like-24-regular" className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Thích</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon icon="fluent:comment-24-regular" className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Bình luận</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon icon="fluent:share-24-regular" className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Chia sẻ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDiscussionPage;
