import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "antd";
import { ExpandableContent } from "../../ui";
import { useSelector } from "react-redux";
import avatardf from "../../../assets/images/avatar_default.png";
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import { useNavigate } from "react-router-dom";
import { LikeButton } from "../../common";
import { apiAddToHistory } from "../../../services/watchService";

// Types
interface AuthState {
  avatar?: string;
  isLoggedIn?: boolean;
}

interface WatchModalProps {
  videoId: string;
  userId: string;
  avatar?: string;
  userName: string;
  location?: string;
  timeAgo: string;
  content: string;
  videoUrl: string;
  thumbnailUrl?: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  tags?: string[];
  privacy?: string;
  liked?: boolean;
  saved?: boolean;
  loading?: boolean;
  onShare?: () => void;
  onUnsave?: () => void;
  watchHistoryId?: string;
  onRemove?: () => void;
}

const WatchModal: React.FC<WatchModalProps> = ({
  videoId,
  userId,
  avatar,
  userName,
  location,
  timeAgo,
  content,
  videoUrl,
  thumbnailUrl,
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  tags = [],
  privacy,
  liked = false,
  saved = false,
  loading = false,
  onShare,
  onUnsave,
  watchHistoryId,
  onRemove,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [isSaved, setIsSaved] = useState<boolean>(saved);
  const [videoLikeCount, setVideoLikeCount] = useState<number>(likeCount);
  const [videoShareCount, setVideoShareCount] = useState<number>(shareCount);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTrackedView = useRef<boolean>(false);
  const viewTrackingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { avatar: currentUserAvatar, isLoggedIn } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );

  const navigate = useNavigate();

  // Track video view and add to history
  useEffect(() => {
    const trackView = async () => {
      if (!videoId || hasTrackedView.current || !isLoggedIn) return;
      
      try {
        await apiAddToHistory(videoId);
        hasTrackedView.current = true;
        console.log("Video added to history from modal");
      } catch (error) {
        console.error("Error adding to history:", error);
      }
    };

    const handleVideoPlay = () => {
      if (hasTrackedView.current || !videoRef.current) return;

      const duration = videoRef.current.duration;
      const THIRTY_MINUTES = 30 * 60; // 30 minutes in seconds

      // Clear any existing timeout
      if (viewTrackingTimeout.current) {
        clearTimeout(viewTrackingTimeout.current);
      }

      if (duration > THIRTY_MINUTES) {
        // Video > 30 minutes: track after 30 minutes of watch time
        viewTrackingTimeout.current = setTimeout(() => {
          trackView();
        }, THIRTY_MINUTES * 1000);
      }
      // For videos <= 30 minutes, track on ended event
    };

    const handleVideoEnded = () => {
      if (hasTrackedView.current || !videoRef.current) return;

      const duration = videoRef.current.duration;
      const THIRTY_MINUTES = 30 * 60;

      // Only track on ended if video <= 30 minutes
      if (duration <= THIRTY_MINUTES) {
        trackView();
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handleVideoPlay);
      videoElement.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handleVideoPlay);
        videoElement.removeEventListener('ended', handleVideoEnded);
      }
      if (viewTrackingTimeout.current) {
        clearTimeout(viewTrackingTimeout.current);
      }
    };
  }, [videoId, isLoggedIn]);

  const handleCommentClick = () => {
    // Navigate to watch detail page
    navigate(`/home/watch/${videoId}`);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    }
    setVideoShareCount((prev) => prev + 1);
  };

  const handleSaveClick = async () => {
    try {
      const { apiSaveWatch, apiUnsaveWatch } = await import('../../../services/watchService');
      
      if (isSaved) {
        await apiUnsaveWatch(videoId);
        setIsSaved(false);
        if (onUnsave) {
          onUnsave();
        }
      } else {
        await apiSaveWatch(videoId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleRemoveClick = async () => {
    if (!onRemove || !watchHistoryId) return;

    try {
      const { apiRemoveFromHistory } = await import('../../../services/watchService');
      await apiRemoveFromHistory(watchHistoryId);
      
      // Call the parent callback to remove from list
      onRemove();
    } catch (error) {
      console.error('Error removing video from history:', error);
    }
  };

  const renderTags = () => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white rounded-xl border border-gray-200">
        {/* User Header Skeleton */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <Skeleton.Avatar active size={40} />
          <div className="flex-1">
            <Skeleton.Input
              active
              size="small"
              style={{ width: 150, marginBottom: 8 }}
            />
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </div>
        </div>

        {/* Content Skeleton */}
        <Skeleton active paragraph={{ rows: 2 }} className="mb-3" />

        {/* Video Skeleton */}
        <Skeleton.Image
          active
          style={{ width: "100%", height: 400 }}
          className="rounded-xl mb-3"
        />

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-3 sm:gap-6 pt-3 border-t border-gray-100">
          <Skeleton.Button active size="small" style={{ width: 80 }} />
          <Skeleton.Button active size="small" style={{ width: 100 }} />
          <Skeleton.Button active size="small" style={{ width: 80 }} />
        </div>

        {/* Comment Input Skeleton */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton.Avatar active size={32} />
            <Skeleton.Input
              active
              style={{ width: "100%", borderRadius: 20 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white rounded-xl border border-gray-200">
      {/* User Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        <img
          src={avatar || avatardf}
          alt="avatar"
          className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer flex-shrink-0"
          onClick={() => navigate(`/home/user/${userId}`)}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span
              className="font-semibold text-sm sm:text-base text-gray-800 cursor-pointer hover:underline hover:text-blue-600 truncate"
              onClick={() => navigate(`/home/user/${userId}`)}
            >
              {userName}
            </span>
            {location && (
              <>
                <span className="text-xs sm:text-sm text-gray-600">
                  {" "}
                  đã chia sẻ video tại{" "}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 truncate">
                  {location}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
            <span>{formatTimeAgo(timeAgo)}</span>
            <Icon icon="fluent:globe-24-filled" className="w-3 h-3 ml-1" />
            {privacy && (
              <span className="ml-1">• {formatPrivacy(privacy)}</span>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <div className="ml-auto flex-shrink-0 flex items-center gap-1">
          {/* Save Button */}
          <button
            className={`cursor-pointer p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isSaved ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={handleSaveClick}
          >
            <Icon
              icon={isSaved ? 'fluent:bookmark-24-filled' : 'fluent:bookmark-24-regular'}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>

          {/* Menu Button - Reserved for future options */}
          <button
            className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => {
              // TODO: Implement dropdown menu with options
              console.log('Menu button clicked - dropdown not implemented yet');
            }}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>

          {/* Close Button - Only show if watchHistoryId exists (history page) */}
          {watchHistoryId && (
            <button
              className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleRemoveClick}
              title="Xóa khỏi lịch sử xem"
            >
              <Icon
                icon="fluent:dismiss-24-regular"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <ExpandableContent
        content={content}
        maxLines={3}
        className="text-sm sm:text-base leading-relaxed break-words mb-3"
      />

      {/* Tags */}
      {renderTags()}

      {/* Video Player */}
      <div className="relative mb-3 group">
        <video
          ref={videoRef}
          src={videoUrl}
          controls={isPlaying}
          className="w-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] rounded-xl object-cover"
          poster={thumbnailUrl}
          onPlay={() => setIsPlaying(true)}
        >
          Trình duyệt không hỗ trợ.
        </video>
        
        {/* Play Button Overlay - Simple Style */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-xl cursor-pointer"
            onClick={handlePlayVideo}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            
            {/* Play Button */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Icon 
                icon="fluent:play-24-filled" 
                className="h-8 w-8 text-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm text-black border-t border-gray-100">
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 9l-2-2-2 2m0 6l2 2 2-2"
            />
          </svg>
        </div>
        <LikeButton
          watchId={videoId}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          likeCount={videoLikeCount}
          setLikeCount={setVideoLikeCount}
        />

        <div
          className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-500"
          onClick={handleCommentClick}
        >
          <Icon
            icon="fluent:chat-24-filled"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>Bình luận {commentCount > 0 && `(${commentCount})`}</span>
        </div>

        <div
          className="flex items-center gap-1 transition-colors cursor-pointer hover:text-green-500"
          onClick={handleShareClick}
        >
          <Icon
            icon="fluent:arrow-reply-24-filled"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>Chia sẻ {videoShareCount > 0 && `(${videoShareCount})`}</span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="w-full cursor-pointer" onClick={handleCommentClick}>
          <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 transition-colors rounded-lg hover:bg-gray-50">
            <img
              src={currentUserAvatar || avatardf}
              alt="current user"
              className="flex-shrink-0 object-cover w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-200"
            />
            <div className="relative flex-1">
              <div className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm text-gray-500 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                Viết bình luận...
              </div>
              <div className="absolute text-gray-400 transform -translate-y-1/2 right-2 sm:right-3 top-1/2">
                <Icon
                  icon="fluent:emoji-happy-24-filled"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WatchModal;
