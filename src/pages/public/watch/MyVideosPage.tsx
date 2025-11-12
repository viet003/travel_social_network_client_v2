import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { VideoThumbnailCard } from '../../../components/common/cards';
import { WatchEditModal } from '../../../components/modal/watch';
import { ConfirmDeleteModal } from '../../../components/modal';
import type { WatchResponse } from '../../../types/video.types';
import { apiGetMyWatches, apiGetMyWatchStatistics, apiDeleteWatch, type WatchStatistics } from '../../../services/watchService';
import { toast } from 'react-toastify';

const MyVideosPage: React.FC = () => {
  const navigate = useNavigate();
  const [myVideos, setMyVideos] = useState<WatchResponse[]>([]);
  const [statistics, setStatistics] = useState<WatchStatistics>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0
  });
  const [loading, setLoading] = useState(true);
  const [page] = useState(0);
  const [size] = useState(100); // Load nhiều videos
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVideoForEdit, setSelectedVideoForEdit] = useState<WatchResponse | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideoForDelete, setSelectedVideoForDelete] = useState<WatchResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load videos và statistics song song
      const [videosResponse, statsResponse] = await Promise.all([
        apiGetMyWatches(page, size),
        apiGetMyWatchStatistics()
      ]);

      if (videosResponse && videosResponse.data) {
        setMyVideos(videosResponse.data.content);
      }

      if (statsResponse && statsResponse.data) {
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading my videos:', error);
      toast.error('Không thể tải danh sách video!');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Handle edit video
  const handleEditVideo = (video: WatchResponse) => {
    console.log('🎬 MyVideosPage - Opening edit modal with video:', {
      watchId: video.watchId,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      privacy: video.privacy
    });
    setSelectedVideoForEdit(video);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedVideo?: WatchResponse) => {
    toast.success('Video đã được cập nhật thành công!');
    
    // Update local state instead of fetching from server
    if (updatedVideo) {
      setMyVideos(prevVideos => 
        prevVideos.map(video => 
          video.watchId === updatedVideo.watchId ? updatedVideo : video
        )
      );
    }
  };

  // Handle delete video
  const handleDeleteVideo = (video: WatchResponse) => {
    setSelectedVideoForDelete(video);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVideoForDelete) return;

    try {
      setIsDeleting(true);
      const deletedVideoId = selectedVideoForDelete.watchId;
      
      await apiDeleteWatch(deletedVideoId);
      
      toast.success('Video đã được xóa thành công!');
      
      // Update local state: remove deleted video
      setMyVideos(prevVideos => prevVideos.filter(video => video.watchId !== deletedVideoId));
      
      // Update statistics: decrease total videos count
      setStatistics(prevStats => ({
        ...prevStats,
        totalVideos: Math.max(0, prevStats.totalVideos - 1),
        totalViews: Math.max(0, prevStats.totalViews - (selectedVideoForDelete.viewCount || 0)),
        totalLikes: Math.max(0, prevStats.totalLikes - (selectedVideoForDelete.likeCount || 0)),
        totalComments: Math.max(0, prevStats.totalComments - (selectedVideoForDelete.commentCount || 0)),
      }));
      
      setIsDeleteModalOpen(false);
      setSelectedVideoForDelete(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Không thể xóa video. Vui lòng thử lại!');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Đang tải video...</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Icon icon="fluent:video-24-filled" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Tổng video</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{statistics.totalVideos}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatNumber(statistics.totalViews)}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatNumber(statistics.totalLikes)}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatNumber(statistics.totalComments)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {myVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon icon="fluent:video-off-24-regular" className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có video nào</h3>
          <p className="text-gray-600 mb-4">Hãy tạo video đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVideos.map((video) => (
            <VideoThumbnailCard
              key={video.watchId}
              id={video.watchId}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl || ''}
              videoUrl={video.videoUrl}
              author={video.user.userName}
              views={video.viewCount}
              time={new Date(video.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              duration={video.duration || 0}
              likeCount={video.likeCount}
              commentCount={video.commentCount}
              showActions={true}
              onClick={() => navigate(`/home/watch/${video.watchId}`)}
              onEdit={() => handleEditVideo(video)}
              onShare={() => console.log('Share video:', video.watchId)}
              onDelete={() => handleDeleteVideo(video)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedVideoForEdit && (
        <WatchEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVideoForEdit(null);
          }}
          onSuccess={handleEditSuccess}
          watchData={{
            watchId: selectedVideoForEdit.watchId,
            title: selectedVideoForEdit.title,
            description: selectedVideoForEdit.description || '',
            videoUrl: selectedVideoForEdit.videoUrl,
            thumbnailUrl: selectedVideoForEdit.thumbnailUrl,
            location: selectedVideoForEdit.location,
            privacy: selectedVideoForEdit.privacy,
            category: 'travel', // You might want to add category to WatchResponse
            tags: selectedVideoForEdit.tags
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedVideoForDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedVideoForDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          type="custom"
          itemName={selectedVideoForDelete.title}
          customTitle="Xóa video"
          customWarning="Bạn có chắc chắn muốn xóa video này không? Hành động này không thể hoàn tác."
          showStats={true}
          stats={[
            {
              icon: 'fluent:eye-24-filled',
              label: 'Lượt xem',
              value: selectedVideoForDelete.viewCount || 0
            },
            {
              icon: 'fluent:heart-24-filled',
              label: 'Lượt thích',
              value: selectedVideoForDelete.likeCount || 0
            },
            {
              icon: 'fluent:comment-24-filled',
              label: 'Bình luận',
              value: selectedVideoForDelete.commentCount || 0
            }
          ]}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default MyVideosPage