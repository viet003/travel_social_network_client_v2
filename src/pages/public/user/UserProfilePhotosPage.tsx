import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react';
import { Image, Skeleton, message } from 'antd';
import { apiGetUserPhotos, type UserPhotoResponse, type UserPhotosWrapper } from '../../../services/photoService';

const UserProfilePhotosPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [photosData, setPhotosData] = useState<UserPhotosWrapper | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user photos
  const fetchPhotos = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiGetUserPhotos(userId);
      if (response.data.data) {
        setPhotosData(response.data.data);
      }
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

  // Combine all photos
  const getAllPhotos = (): UserPhotoResponse[] => {
    if (!photosData) return [];
    
    const allPhotos: UserPhotoResponse[] = [];
    if (photosData.avatars) allPhotos.push(...photosData.avatars);
    if (photosData.coverImages) allPhotos.push(...photosData.coverImages);
    if (photosData.postPhotos) allPhotos.push(...photosData.postPhotos);
    
    return allPhotos;
  };

  const allPhotos = getAllPhotos();

  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="text-sm sm:text-base text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <div className="py-8 sm:py-12 text-center">
        <Icon icon="lucide:image" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
        <p className="text-sm sm:text-base text-gray-500">Chưa có ảnh nào</p>
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
            <Image.PreviewGroup>
              <div className="grid grid-cols-5 gap-2 bg-gray-50 rounded-xl p-2">
                {photosData.avatars.map((photo) => (
                  <div
                    key={photo.photoId}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt="Avatar"
                      className="cursor-pointer"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        display: "block",
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                      placeholder={
                        <Skeleton.Image
                          active
                          style={{ width: "100%", height: "100%" }}
                        />
                      }
                      preview={{
                        mask: (
                          <div className="flex items-center justify-center">
                            Xem
                          </div>
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}

        {/* Cover Photos */}
        {photosData?.coverImages && photosData.coverImages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:image" width={24} />
              Ảnh bìa ({photosData.coverImages.length})
            </h3>
            <Image.PreviewGroup>
              <div className="grid grid-cols-5 gap-2 bg-gray-50 rounded-xl p-2">
                {photosData.coverImages.map((photo) => (
                  <div
                    key={photo.photoId}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt="Cover"
                      className="cursor-pointer"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        display: "block",
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                      placeholder={
                        <Skeleton.Image
                          active
                          style={{ width: "100%", height: "100%" }}
                        />
                      }
                      preview={{
                        mask: (
                          <div className="flex items-center justify-center">
                            Xem
                          </div>
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}

        {/* Post Photos */}
        {photosData?.postPhotos && photosData.postPhotos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon icon="lucide:images" width={24} />
              Ảnh bài viết ({photosData.postPhotos.length})
            </h3>
            <Image.PreviewGroup>
              <div className="grid grid-cols-5 gap-2 bg-gray-50 rounded-xl p-2">
                {photosData.postPhotos.map((photo) => (
                  <div
                    key={photo.photoId}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={photo.url}
                      alt="Post Photo"
                      className="cursor-pointer"
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        display: "block",
                        minHeight: "100%",
                        minWidth: "100%",
                      }}
                      placeholder={
                        <Skeleton.Image
                          active
                          style={{ width: "100%", height: "100%" }}
                        />
                      }
                      preview={{
                        mask: (
                          <div className="flex items-center justify-center">
                            Xem
                          </div>
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePhotosPage;
