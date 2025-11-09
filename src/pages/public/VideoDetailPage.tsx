import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { message } from 'antd';
import { TravelButton } from '../../components/ui/customize';
import avatardf from '../../assets/images/avatar_default.png';

// Types
interface VideoDetailData {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  title: string;
  description?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  tags?: string[];
  category?: string;
  duration?: number;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoDetailData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch video detail
  useEffect(() => {
    const fetchVideoDetail = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await apiGetVideoDetail(videoId);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockData: VideoDetailData = {
          id: videoId || '1',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          thumbnailUrl: 'https://picsum.photos/800/600',
          author: {
            id: '1',
            name: 'Liên Minh Montage',
            avatar: 'https://i.pravatar.cc/150?img=1',
          },
          title: 'VSGG "Who is the KING?" Sự kiện',
          description: 'Dự đoán Worlds S15 để có cơ hội rinh "MỘT TRĂM TRIỆU" dành riêng cho người ...',
          createdAt: new Date().toISOString(),
          views: 1234,
          likes: 15,
          comments: 2,
          shares: 0,
          isLiked: false,
          tags: ['#CKTG2025', '#T1WIN'],
          category: 'Esports',
          duration: 180,
        };

        const mockComments: Comment[] = [
          {
            id: '1',
            user: {
              id: '2',
              name: 'Đinh Việt Anh',
              avatar: 'https://i.pravatar.cc/150?img=2',
            },
            content: 'Video rất hay và bổ ích!',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            likes: 0,
            isLiked: false,
          },
        ];

        setVideoData(mockData);
        setComments(mockComments);
      } catch {
        message.error('Không thể tải chi tiết video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]);

  const handleLike = async () => {
    if (!videoData) return;
    
    try {
      // TODO: Call API to like/unlike video
      setVideoData({
        ...videoData,
        isLiked: !videoData.isLiked,
        likes: videoData.isLiked ? videoData.likes - 1 : videoData.likes + 1,
      });
    } catch {
      message.error('Không thể thích video');
    }
  };

  const handleCommentLike = async (commentId: string) => {
    try {
      // TODO: Call API to like/unlike comment
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      }));
    } catch {
      message.error('Không thể thích bình luận');
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !videoData) return;

    setIsSubmitting(true);
    try {
      // TODO: Call API to submit comment
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment: Comment = {
        id: Date.now().toString(),
        user: {
          id: 'current-user',
          name: 'Bạn',
          avatar: 'https://i.pravatar.cc/150?img=10',
        },
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };

      setComments([...comments, newComment]);
      setCommentText('');
      setVideoData({
        ...videoData,
        comments: videoData.comments + 1,
      });
      message.success('Đã bình luận');
    } catch {
      message.error('Không thể bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Icon icon="fluent:error-circle-24-regular" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Không tìm thấy video</p>
          <TravelButton type="primary" className="mt-4" onClick={() => navigate(-1)}>
            Quay lại
          </TravelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <TravelButton
                type="text"
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                <Icon icon="fluent:arrow-left-24-filled" className="h-5 w-5" />
              </TravelButton>
              <h1 className="text-lg font-semibold text-gray-900">Chi tiết video</h1>
            </div>
            <TravelButton
              type="text"
              onClick={() => window.open(videoData.videoUrl, '_blank')}
            >
              <Icon icon="fluent:open-24-regular" className="h-5 w-5" />
            </TravelButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video Display */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                src={videoData.videoUrl}
                controls
                className="w-full h-auto max-h-[70vh]"
                poster={videoData.thumbnailUrl}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>

          {/* Right: Info & Comments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full lg:max-h-[70vh]">
              {/* Author Info */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={videoData.author.avatar || avatardf}
                    alt={videoData.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{videoData.author.name}</h3>
                    <p className="text-xs text-gray-500">{formatDate(videoData.createdAt)}</p>
                  </div>
                  <TravelButton type="default" className="text-sm px-3 py-1">
                    Theo dõi
                  </TravelButton>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-lg font-semibold text-gray-900">{videoData.title}</h2>

                {/* Description */}
                {videoData.description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {videoData.description}
                  </p>
                )}

                {/* Category & Views */}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  {videoData.category && (
                    <div className="flex items-center">
                      <Icon icon="fluent:tag-24-regular" className="h-4 w-4 mr-1" />
                      {videoData.category}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Icon icon="fluent:eye-24-regular" className="h-4 w-4 mr-1" />
                    {formatViews(videoData.views)} lượt xem
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{videoData.likes} lượt thích</span>
                    <span>{videoData.comments} bình luận</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <TravelButton
                    type={videoData.isLiked ? 'primary' : 'default'}
                    onClick={handleLike}
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Icon icon={videoData.isLiked ? 'fluent:thumb-like-24-filled' : 'fluent:thumb-like-24-regular'} className="h-5 w-5" />
                    <span>Thích</span>
                  </TravelButton>
                  <TravelButton
                    type="default"
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Icon icon="fluent:share-24-regular" className="h-5 w-5" />
                    <span>Chia sẻ</span>
                  </TravelButton>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 sticky top-0 bg-white pb-2">
                  Bình luận ({comments.length})
                </h3>
                
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Icon icon="fluent:comment-24-regular" className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Chưa có bình luận nào</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.user.avatar || avatardf}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="font-semibold text-sm text-gray-900">{comment.user.name}</p>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`hover:text-blue-600 ${comment.isLiked ? 'text-blue-600 font-semibold' : ''}`}
                          >
                            Thích {comment.likes > 0 && `(${comment.likes})`}
                          </button>
                          <button className="hover:text-blue-600">Trả lời</button>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://i.pravatar.cc/150?img=10"
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                      placeholder="Viết bình luận..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || isSubmitting}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Icon icon="fluent:send-24-filled" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;
