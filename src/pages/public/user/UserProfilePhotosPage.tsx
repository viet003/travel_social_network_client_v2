import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import { message } from 'antd';
import { apiGetUserPhotos } from '../../../services/userService';
import { formatTimeAgo } from '../../../utilities/helper';
import type { UserMediaResponse, UserPhotosResponse } from '../../../types/user.types';

const UserProfilePhotosPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [photosData, setPhotosData] = useState<UserPhotosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user photos
  const fetchPhotos = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiGetUserPhotos(userId);
      setPhotosData(response.data);
    } catch (err) {
      console.error("Error fetching photos:", err);
      message.error('Không thể tải ảnh');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handlePhotoClick = (mediaId: string, postId: string) => {
    // Navigate to media post detail page
    navigate(`/home/post/${postId}/media/${mediaId}`);
  };

  // Combine all photos
  const getAllPhotos = (): UserMediaResponse[] => {
    if (!photosData) return [];
    
    const allPhotos: UserMediaResponse[] = [];
    if (photosData.avatars) allPhotos.push(...photosData.avatars);
    if (photosData.coverImages) allPhotos.push(...photosData.coverImages);
    if (photosData.postPhotos) allPhotos.push(...photosData.postPhotos);
    
    return allPhotos;
  };

  const allPhotos = getAllPhotos();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Icon icon="fluent:image-24-regular" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Chưa có ảnh nào</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Photo Sections */}
      <div className="space-y-8">
        {/* Avatar Photos */}
        {photosData?.avatars && photosData.avatars.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:user-circle" width={24} />
              Ảnh đại diện ({photosData.avatars.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photosData.avatars.map((photo) => (
                <div
                  key={photo.mediaId}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePhotoClick(photo.mediaId, photo.postId)}
                >
                  <img
                    src={photo.url}
                    alt="Avatar"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium">Xem ảnh đại diện</p>
                      <div className="flex items-center text-white text-xs mt-1">
                        <Icon icon="fluent:clock-24-regular" className="h-3.5 w-3.5 mr-1" />
                        <span>{formatTimeAgo(photo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cover Photos */}
        {photosData?.coverImages && photosData.coverImages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:image" width={24} />
              Ảnh bìa ({photosData.coverImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photosData.coverImages.map((photo) => (
                <div
                  key={photo.mediaId}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePhotoClick(photo.mediaId, photo.postId)}
                >
                  <img
                    src={photo.url}
                    alt="Cover"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium">Xem ảnh bìa</p>
                      <div className="flex items-center text-white text-xs mt-1">
                        <Icon icon="fluent:clock-24-regular" className="h-3.5 w-3.5 mr-1" />
                        <span>{formatTimeAgo(photo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Photos */}
        {photosData?.postPhotos && photosData.postPhotos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:images" width={24} />
              Ảnh bài viết ({photosData.postPhotos.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photosData.postPhotos.map((photo) => (
                <div
                  key={photo.mediaId}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePhotoClick(photo.mediaId, photo.postId)}
                >
                  <img
                    src={photo.url}
                    alt="Post Photo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium">Xem ảnh</p>
                      <div className="flex items-center text-white text-xs mt-1">
                        <Icon icon="fluent:clock-24-regular" className="h-3.5 w-3.5 mr-1" />
                        <span>{formatTimeAgo(photo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePhotosPage;
