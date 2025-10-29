import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import PostDetailModal from './PostDetailModal';
import { ExpandableContent } from '../../ui';
import { useSelector } from 'react-redux';
import avatardf from '../../../assets/images/avatar_default.png';
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import { useNavigate } from 'react-router-dom';
import { LikeButton } from '../../common';
import { TravelImage } from '../../ui/customize';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { PostOptionsDropdown } from '../../common/dropdowns';
import '../../../styles/post-modal.css';

// Types
interface MediaItem {
  type: 'IMAGE' | 'VIDEO';
  url: string;
}

interface Group {
  groupId: string;
  groupName: string;
  coverImageUrl?: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  avatar?: string;
}

interface PostModalProps {
  postId: string;
  userId: string;
  avatar?: string;
  userName: string;
  location?: string;
  timeAgo: string;
  content: string;
  image?: string;
  video?: string;
  mediaList?: MediaItem[];
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  tags?: string[];
  isShare?: boolean;
  privacy?: string;
  group?: Group | null;
  comments?: Comment[];
  onShare?: () => void;
  onImageClick?: (img: string, index: number) => void;
  onComment?: (comment: Comment) => void;
  liked?: boolean;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  userId,
  avatar,
  userName,
  location,
  timeAgo,
  content,
  image,
  video,
  mediaList = [],
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  tags = [],
  isShare = false,
  privacy,
  group = null,
  comments: _comments = [],
  onShare,
  onImageClick,
  onComment: _onComment,
  liked = false
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState<boolean>(false);
  const { avatar: currentUserAvatar } = useSelector((state: { auth: AuthState }) => state.auth);
  const [postLikeCount, setPostLikeCount] = useState<number>(likeCount);
  const [postCommentCount, setPostCommentCount] = useState<number>(commentCount);
  const [postShareCount, _setPostShareCount] = useState<number>(shareCount);

  const navigate = useNavigate();

  // Process mediaList to separate images and videos
  const imageMedia = mediaList.filter(media => media.type === 'IMAGE');
  const videoMedia = mediaList.filter(media => media.type === 'VIDEO');

  // Handle both single image and multiple images from mediaList
  const displayImages = imageMedia.length > 0 ? imageMedia.map(media => media.url) : (image ? [image] : []);
  const displayVideo = videoMedia.length > 0 ? videoMedia[0].url : video;

  const handleImageClick = (img: string, index: number) => {
    setSelectedImageIndex(index);
    if (onImageClick) {
      onImageClick(img, index);
    }
  };

  const handleComment = () => {
    setPostCommentCount(prev => prev + 1);
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleGroupClick = () => {
    if (group?.groupId) {
      navigate(`/home/groups/${group.groupId}`);
    }
  };

  const renderSingleImage = (img: string, index: number) => (
    <div key={index} style={{ marginBottom: '12px' }}>
      <TravelImage
        src={img}
        alt="post"
        onClick={() => handleImageClick(img, index)}
        preview={{
          mask: 'Xem ảnh',
        }}
      />
    </div>
  );

  const renderVideo = (videoUrl: string) => (
    <div className="relative mb-3">
      <video
        src={videoUrl}
        controls
        className="object-cover w-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh] rounded-xl"
        poster=""
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );

  const renderImageSlider = () => {
    if (displayImages.length === 0) return null;

    if (displayImages.length === 1) {
      return renderSingleImage(displayImages[0], 0);
    }

    return (
      <div className="relative mb-3">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ 
            clickable: true,
            dynamicBullets: true
          }}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          className="post-swiper rounded-xl"
          style={{ 
            borderRadius: '12px',
            '--swiper-navigation-size': '20px'
          } as React.CSSProperties}
        >
          {displayImages.map((img, index) => (
            <SwiperSlide key={index}>
              <TravelImage
                src={img}
                alt={`post-${index}`}
                className="w-full"
                style={{ borderRadius: '12px' }}
                preview={{
                  mask: 'Xem ảnh',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  const renderTags = () => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  const renderGroupHeader = () => {
    if (!group) return null;

    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2">
          {/* Group Cover with Avatar Overlay */}
          <div className="relative flex-shrink-0">
            <img
              src={group.coverImageUrl || avatardf}
              alt={group.groupName}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
            />
            {/* User Avatar Overlay */}
            <img
              src={avatar || avatardf}
              alt="avatar"
              className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-full border-2 border-white cursor-pointer"
              onClick={() => { console.log(userId); navigate(`/user/${userId}`) }}
            />
          </div>

          {/* Group and User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span
                className="font-semibold text-sm sm:text-base text-gray-800 hover:underline cursor-pointer truncate"
                onClick={handleGroupClick}
              >
                {group.groupName}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">•</span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{formatTimeAgo(timeAgo)}</span>
              <span className="text-gray-500 text-xs sm:text-sm">•</span>
              <Icon icon="fluent:globe-24-filled" className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
              <span
                className="hover:underline cursor-pointer truncate"
                onClick={() => { navigate(`/user/${userId}`) }}
              >
                {userName}
              </span>
              {location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 truncate">{location}</span>
                </>
              )}
            </div>
          </div>

          {/* Menu button */}
          <div className="ml-auto flex-shrink-0 relative">
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
            {showOptionsDropdown && (
              <PostOptionsDropdown 
                onClose={() => setShowOptionsDropdown(false)}
                postId={postId}
                isOwner={false}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white shadow rounded-xl">
        {/* Share indicator */}
        {isShare && (
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-500">
            <Icon icon="fluent:arrow-reply-24-filled" className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Đã chia sẻ một bài viết</span>
          </div>
        )}

        {/* Group Header - Only show if group exists */}
        {renderGroupHeader()}

        {/* User info for non-group posts only */}
        {!group && (
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <img
              src={avatar || avatardf}
              alt="avatar"
              className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer flex-shrink-0"
              onClick={() => { console.log(userId); navigate(`/user/${userId}`) }}
            />
            <div className='flex flex-col flex-1 min-w-0'>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="font-semibold text-sm sm:text-base text-gray-800 cursor-pointer hover:underline hover:text-blue-600 truncate"
                  onClick={() => { navigate(`/user/${userId}`) }}
                >{userName}</span>
                {location && <span className="text-xs text-gray-500 truncate">• {location}</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
                <span>{formatTimeAgo(timeAgo)}</span>
                <Icon icon="fluent:globe-24-filled" className="w-3 h-3 ml-1" />
                {privacy && <span className="ml-1">• {formatPrivacy(privacy)}</span>}
              </div>
            </div>
            <div className="ml-auto flex-shrink-0 relative">
              <button 
                className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="18" r="1.5" />
                </svg>
              </button>
              {showOptionsDropdown && (
                <PostOptionsDropdown 
                  onClose={() => setShowOptionsDropdown(false)}
                  postId={postId}
                  isOwner={false}
                />
              )}
            </div>
          </div>
        )}

        {/* Content with expandable functionality */}
        <ExpandableContent content={content} maxLines={3} className="text-sm sm:text-base leading-relaxed break-words" />

        {/* Tags */}
        {renderTags()}

        {/* Media rendering logic */}
        {displayVideo && renderVideo(displayVideo)}
        {displayImages.length > 0 && renderImageSlider()}

        {/* Action buttons */}
        <div className="flex items-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-2-2-2 2m0 6l2 2 2-2" />
            </svg>
          </div>
          <LikeButton
            postId={postId}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            likeCount={postLikeCount}
            setLikeCount={setPostLikeCount}
          />
          <div className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-500" onClick={openCommentModal}>
            <Icon icon="fluent:chat-24-filled" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">{postCommentCount}</span>
            <span className="xs:hidden">{postCommentCount > 99 ? '99+' : postCommentCount}</span>
          </div>
          <div className="flex items-center gap-1 transition-colors cursor-pointer hover:text-green-500" onClick={onShare}>
            <Icon icon="fluent:arrow-reply-24-filled" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">{postShareCount}</span>
            <span className="xs:hidden">{postShareCount > 99 ? '99+' : postShareCount}</span>
          </div>
        </div>

        {/* Comment input section */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button className="w-full cursor-pointer" onClick={openCommentModal}>
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
                  <Icon icon="fluent:emoji-happy-24-filled" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        isOpen={showCommentModal}
        onClose={closeCommentModal}
        postId={postId}
        userId={userId}
        avatar={avatar}
        userName={userName}
        location={location}
        timeAgo={timeAgo}
        content={content}
        displayImages={displayImages}
        displayVideo={displayVideo}
        selectedImageIndex={selectedImageIndex}
        postLikeCount={postLikeCount}
        setPostLikeCount={setPostLikeCount}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        postCommentCount={postCommentCount}
        handleComment={handleComment}
        currentUserAvatar={currentUserAvatar}
        tags={tags}
        isShare={isShare}
        privacy={privacy}
        group={group}
        postShareCount={postShareCount}
        onShare={onShare}
      />
    </>
  );
};

export default PostModal;