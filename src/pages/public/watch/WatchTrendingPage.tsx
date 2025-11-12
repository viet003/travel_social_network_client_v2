import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import WatchModal from '../../../components/modal/watch/WatchModal';
import type { WatchResponse } from '../../../types/video.types';
import { apiGetTrendingWatches } from '../../../services/watchService';
import { message } from 'antd';

const WatchTrendingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trendingVideos, setTrendingVideos] = useState<WatchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [days, setDays] = useState(7);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchTrendingVideos = useCallback(async (pageNum: number, daysFilter: number) => {
    setLoading(true);
    try {
      const response = await apiGetTrendingWatches(pageNum, 10, daysFilter);
      const newVideos = response.data.content;

      if (pageNum === 0) {
        setTrendingVideos(newVideos);
      } else {
        setTrendingVideos(prev => [...prev, ...newVideos]);
      }

      setHasMore(newVideos.length > 0 && !response.data.last);
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      message.error('Không thể tải video thịnh hành');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    setTrendingVideos([]);
    setHasMore(true);
    fetchTrendingVideos(0, days);
  }, [days, fetchTrendingVideos]);

  useEffect(() => {
    if (page > 0) {
      fetchTrendingVideos(page, days);
    }
  }, [page, days, fetchTrendingVideos]);

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

  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:fire-24-filled" className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">Video thịnh hành</h1>
          </div>
          <button
            onClick={() => navigate('/home/watch')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="fluent:arrow-left-24-regular" className="w-4 h-4" />
            Quay lại
          </button>
        </div>

        {/* Filter by days */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Thời gian:</span>
          <div className="flex gap-2">
            {[1, 7, 30].map((d) => (
              <button
                key={d}
                onClick={() => handleDaysChange(d)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d === 1 ? 'Hôm nay' : d === 7 ? '7 ngày' : '30 ngày'}
              </button>
            ))}
          </div>
        </div>
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
        ) : trendingVideos.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="fluent:video-off-24-regular" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">Chưa có video thịnh hành</p>
            <p className="text-gray-500 text-sm">Hãy quay lại sau để xem video thịnh hành mới nhất</p>
          </div>
        ) : (
          <>
            {trendingVideos.map((video, index) => (
              <div
                key={video.watchId}
                ref={trendingVideos.length === index + 1 ? lastVideoElementRef : null}
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
                  onShare={() => console.log('Share video', video.watchId)}
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

            {!hasMore && trendingVideos.length > 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Đã hiển thị tất cả video thịnh hành</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchTrendingPage;
