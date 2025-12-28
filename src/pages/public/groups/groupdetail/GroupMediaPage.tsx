import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Icon } from '@iconify/react';
import TravelButton from '../../../../components/ui/customize/TravelButton';
import LoadingSpinner from '../../../../components/ui/loading/LoadingSpinner';
import { apiGetGroupMedia } from '../../../../services/groupService';
import type { GroupResponse } from '../../../../types/group.types';
import type { PostMediaResponse } from '../../../../types/media.types';

interface OutletContext {
  groupData: GroupResponse | null;
  isMember: boolean;
  currentUserRole: string | null;
}

const GroupMediaPage: React.FC = () => {
  const { isMember, currentUserRole } = useOutletContext<OutletContext>();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [photos, setPhotos] = useState<PostMediaResponse[]>([]);
  const [videos, setVideos] = useState<PostMediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch media when tab changes
  useEffect(() => {
    if (!groupId || (!isMember && currentUserRole !== 'ADMIN')) return;
    
    const fetchMedia = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const mediaType = activeMediaTab === 'photos' ? 'IMAGE' : 'VIDEO';
        const response = await apiGetGroupMedia(groupId, mediaType);
        
        if (activeMediaTab === 'photos') {
          setPhotos(response.data);
        } else {
          setVideos(response.data);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Không thể tải media. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [groupId, activeMediaTab, isMember, currentUserRole]);

  const mediaTabs = [
    { id: 'photos' as const, label: 'Ảnh', icon: 'fluent:image-24-filled', count: photos.length },
    { id: 'videos' as const, label: 'Video', icon: 'fluent:video-24-filled', count: videos.length },
  ];

  const handleMediaClick = (mediaId: string | number, postId: string) => {
    navigate(`/home/post/${postId}/media/${String(mediaId)}`);
  };

  return (
    <div className="space-y-4">
      {!isMember && currentUserRole !== 'ADMIN' ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Icon
            icon="fluent:lock-closed-24-regular"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vui lòng tham gia nhóm
          </h3>
          <p className="text-gray-500">
            Bạn cần tham gia nhóm để xem file phương tiện
          </p>
        </div>
      ) : (
        <>
      {/* Media Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {mediaTabs.map((tab) => (
            <TravelButton
              key={tab.id}
              type={activeMediaTab === tab.id ? 'primary' : 'default'}
              onClick={() => setActiveMediaTab(tab.id)}
              className="flex-shrink-0"
            >
              <div className="flex items-center space-x-2">
                <Icon icon={tab.icon} className="h-5 w-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeMediaTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </div>
            </TravelButton>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size={40} color="#2563eb" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (
        <>
          {activeMediaTab === 'photos' && photos.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Icon icon="fluent:image-24-regular" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Chưa có ảnh nào trong nhóm</p>
            </div>
          )}
          
          {activeMediaTab === 'videos' && videos.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Icon icon="fluent:video-24-regular" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Chưa có video nào trong nhóm</p>
            </div>
          )}
        </>
      )}

      {/* Photos Grid */}
      {!isLoading && !error && activeMediaTab === 'photos' && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.mediaId}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMediaClick(photo.mediaId, photo.postId)}
            >
              <img
                src={photo.url}
                alt="Group photo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium">Xem bài viết</p>
                  <div className="flex items-center text-white text-xs mt-1">
                    <Icon icon="fluent:arrow-right-24-filled" className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {!isLoading && !error && activeMediaTab === 'videos' && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.mediaId}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMediaClick(video.mediaId, video.postId)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.url}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Icon icon="fluent:play-24-filled" className="h-8 w-8 text-blue-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">Nhấn để xem bài viết</p>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default GroupMediaPage;

