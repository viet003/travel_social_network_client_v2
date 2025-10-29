import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react';
import { Image, Skeleton } from 'antd';

// Types
interface Photo {
  photoId: string;
  url: string;
  title?: string;
  createdAt: string;
}

const UserProfileAlbumsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user photos
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockPhotos: Photo[] = Array.from({ length: 24 }, (_, i) => ({
        photoId: `photo-${i}`,
        url: `https://picsum.photos/400/400?random=${i}`,
        title: `Ảnh ${i + 1}`,
        createdAt: new Date().toISOString(),
      }));
      setPhotos(mockPhotos);
    } catch (err) {
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchPhotos();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="text-sm sm:text-base text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="py-8 sm:py-12 text-center">
        <Icon icon="lucide:image" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
        <p className="text-sm sm:text-base text-gray-500">Chưa có ảnh nào</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Image.PreviewGroup>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {photos.map((photo) => (
            <div
              key={photo.photoId}
              className="aspect-square overflow-hidden bg-gray-200 rounded-lg"
            >
              <Image
                src={photo.url}
                alt={photo.title || 'Photo'}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
                placeholder={
                  <Skeleton.Image 
                    active 
                    style={{ width: '100%', height: '100%' }}
                  />
                }
              />
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
    </div>
  );
};

export default UserProfileAlbumsPage;
