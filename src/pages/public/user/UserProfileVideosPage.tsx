import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import { message } from 'antd';
import { apiGetUserVideos } from '../../../services/userService';
import { formatTimeAgo } from '../../../utilities/helper';
import type { UserMediaResponse } from '../../../types/user.types';

const UserProfileVideosPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<UserMediaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user videos
  const fetchVideos = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiGetUserVideos(userId);
      setVideos(response.data.videos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      message.error('Không thể tải video');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoClick = (mediaId: string, postId: string) => {
    // Navigate to media post detail page using mediaId and postId
    navigate(`/home/post/${postId}/media/${mediaId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Icon icon="fluent:video-24-regular" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Chưa có video nào</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Video Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Icon icon="fluent:video-24-filled" width={24} />
          Video ({videos.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video.mediaId}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleVideoClick(video.mediaId, video.postId)}
            >
              {/* Video thumbnail - use video URL */}
              <img
                src={video.url}
                alt="Video"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon icon="fluent:play-24-filled" className="h-6 w-6 text-blue-600 ml-0.5" />
                </div>
              </div>
              
              {/* Hover info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    Video
                  </p>
                  <div className="flex items-center text-white text-xs mt-1">
                    <Icon icon="fluent:clock-24-regular" className="h-3.5 w-3.5 mr-1" />
                    <span>{formatTimeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileVideosPage;
