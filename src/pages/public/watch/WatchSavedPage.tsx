import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import WatchModal from '../../../components/modal/watch/WatchModal';
import type { WatchResponse } from '../../../types/video.types';
import { apiGetSavedWatches } from '../../../services/watchService';
import { message } from 'antd';

const WatchSavedPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedVideos, setSavedVideos] = useState<WatchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchSavedVideos = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await apiGetSavedWatches(pageNum, 10);
      const newVideos = response.data.content;

      if (pageNum === 0) {
        setSavedVideos(newVideos);
      } else {
        setSavedVideos(prev => [...prev, ...newVideos]);
      }

      setHasMore(newVideos.length > 0 && !response.data.last);
    } catch (error) {
      console.error('Error fetching saved videos:', error);
      message.error('Không thể tải video đã lưu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedVideos(0);
  }, [fetchSavedVideos]);

  useEffect(() => {
    if (page > 0) {
      fetchSavedVideos(page);
    }
  }, [page, fetchSavedVideos]);

  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleVideoUnsaved = (watchId: string) => {
    setSavedVideos(prev => prev.filter(video => video.watchId !== watchId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:bookmark-24-filled" className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Video đã lưu</h1>
          </div>
          <button
            onClick={() => navigate('/home/watch')}
            className="flex cursor-pointer hover:bg-gray-100 items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-colors"
          >
            <Icon icon="fluent:arrow-left-24-regular" className="w-4 h-4" />
            Quay lại
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          Danh sách các video bạn đã lưu để xem sau
        </p>
      </div>

      {/* Videos List */}
      <div className="space-y-6">
        {loading && page === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Đang tải...</span>
            </div>
          </div>
        ) : savedVideos.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="fluent:bookmark-off-24-regular" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">Chưa có video đã lưu</p>
            <p className="text-gray-500 text-sm mb-4">Lưu các video yêu thích để xem sau</p>
            <button
              onClick={() => navigate('/home/watch')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá video
            </button>
          </div>
        ) : (
          <>
            {savedVideos.map((video, index) => (
              <div
                key={video.watchId}
                ref={savedVideos.length === index + 1 ? lastVideoElementRef : null}
              >
                <WatchModal
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
                  saved={video.saved}
                  onShare={() => console.log('Share video', video.watchId)}
                  onUnsave={() => handleVideoUnsaved(video.watchId)}
                />
              </div>
            ))}

            {loading && page > 0 && (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-sm">Đang tải thêm...</span>
                </div>
              </div>
            )}

            {!hasMore && savedVideos.length > 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Đã hiển thị tất cả video đã lưu</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchSavedPage;
