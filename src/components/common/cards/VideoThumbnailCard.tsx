import React from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "antd";

export interface VideoThumbnailCardProps {
  id: string | number;
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  author?: string;
  views?: string | number;
  time?: string;
  duration?: string | number;
  likeCount?: number;
  commentCount?: number;
  loading?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const VideoThumbnailCard: React.FC<VideoThumbnailCardProps> = ({
  title,
  videoUrl,
  thumbnailUrl,
  author,
  views,
  time,
  duration,
  likeCount,
  commentCount,
  loading = false,
  onClick,
  onEdit,
  onShare,
  onDelete,
  showActions = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const formatDuration = (dur: string | number): string => {
    if (typeof dur === 'string') return dur;
    const mins = Math.floor(dur / 60);
    const secs = dur % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (viewCount: string | number): string => {
    if (typeof viewCount === 'string') return viewCount;
    if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    }
    return viewCount.toString();
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="group bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
        {/* Video Skeleton */}
        <div className="relative aspect-video bg-gray-200">
          <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title Skeleton */}
          <Skeleton active paragraph={{ rows: 2 }} className="mb-2" />

          {/* Stats Skeleton */}
          <div className="flex items-center gap-3 mb-2">
            <Skeleton.Button active size="small" style={{ width: 50 }} />
            <Skeleton.Button active size="small" style={{ width: 50 }} />
          </div>

          {/* Footer Skeleton */}
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between mb-3">
              <Skeleton.Input active size="small" style={{ width: 100 }} />
              <Skeleton.Input active size="small" style={{ width: 80 }} />
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <Skeleton.Button active style={{ width: '100%' }} />
                <Skeleton.Button active style={{ width: '100%' }} />
                <Skeleton.Button active style={{ width: 40 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Video Preview with Play Overlay */}
      <div 
        onClick={handleClick}
        className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
      >
        {/* Thumbnail or Video Preview */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : videoUrl ? (
          <video
            src={`${videoUrl}#t=1`}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Icon icon="fluent:video-24-regular" className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Clickable Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <Icon
              icon="fluent:play-24-filled"
              className="h-8 w-8 text-blue-600"
            />
          </div>
        </div>

        {/* Duration Badge */}
        {duration !== undefined && duration !== 0 && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="text-white text-xs font-medium">{formatDuration(duration)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Stats Row */}
        {(views !== undefined || likeCount !== undefined || commentCount !== undefined) && (
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            {views !== undefined && (
              <span className="flex items-center gap-1">
                <Icon icon="fluent:eye-24-regular" className="h-3.5 w-3.5" />
                <span>{formatViews(views)}</span>
              </span>
            )}
            {likeCount !== undefined && (
              <span className="flex items-center gap-1">
                <Icon icon="fluent:heart-24-regular" className="h-3.5 w-3.5" />
                <span>{likeCount}</span>
              </span>
            )}
            {commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <Icon icon="fluent:comment-24-regular" className="h-3.5 w-3.5" />
                <span>{commentCount}</span>
              </span>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-auto">
          {(author || time) && (
            <div className="pt-2 flex items-center justify-between text-xs mb-3">
              {/* Author */}
              {author && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Icon icon="fluent:person-24-filled" className="h-3.5 w-3.5" />
                  <span className="font-medium truncate max-w-[120px]">{author}</span>
                </div>
              )}

              {/* Time */}
              {time && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Icon icon="fluent:clock-24-regular" className="h-3.5 w-3.5" />
                  <span>{time}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {onEdit && (
                <button 
                  onClick={onEdit}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon icon="fluent:edit-24-regular" className="h-4 w-4" />
                  <span>Sửa</span>
                </button>
              )}
              {onShare && (
                <button 
                  onClick={onShare}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Icon icon="fluent:share-24-regular" className="h-4 w-4" />
                  <span>Chia sẻ</span>
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={onDelete}
                  className="px-3 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon icon="fluent:delete-24-regular" className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnailCard;

