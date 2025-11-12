import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Skeleton } from "antd";
import PostDetailModal from "./PostDetailModal";
import SharePostModal from "./SharePostModal";
import PostEditModal from "./PostEditModal";
import ConfirmDeleteModal from "../confirm/ConfirmDeleteModal";
import SharedPostPreview from "./SharedPostPreview";
import { ExpandableContent } from "../../ui";
import { useSelector } from "react-redux";
import avatardf from "../../../assets/images/avatar_default.png";
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import { useNavigate } from "react-router-dom";
import { LikeButton } from "../../common";
import { TravelImage } from "../../ui/customize";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { PostOptionsDropdown } from "../../common/dropdowns";
import type { PostResponse } from "../../../types/post.types";
import { toast } from "react-toastify";
import { apiDeletePost } from "../../../services/postService";
import "../../../styles/post-modal.css";

// Types
interface MediaItem {
  type: "IMAGE" | "VIDEO";
  url: string;
}

interface Group {
  groupId: string;
  groupName: string;
  coverImageUrl?: string;
}

interface AuthState {
  avatar?: string;
  firstName?: string;
  lastName?: string;
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
  sharedPost?: PostResponse | null;
  privacy?: string;
  group?: Group | null;
  postType?: "NORMAL" | "AVATAR_UPDATE" | "COVER_UPDATE";
  loading?: boolean;
  onShare?: () => void;
  onImageClick?: (img: string, index: number) => void;
  liked?: boolean;
  onHidePost?: () => void;
  onEditPost?: () => void;
  onDeletePost?: () => void;
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
  sharedPost = null,
  privacy,
  group = null,
  postType = "NORMAL",
  loading = false,
  onShare,
  onImageClick,
  liked = false,
  onHidePost,
  onEditPost,
  onDeletePost,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [showOptionsDropdown, setShowOptionsDropdown] =
    useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const {
    avatar: currentUserAvatar,
    firstName,
    lastName,
  } = useSelector((state: { auth: AuthState }) => state.auth);
  const currentUserName =
    `${firstName || ""} ${lastName || ""}`.trim() || "Bạn";
  const [postLikeCount, setPostLikeCount] = useState<number>(likeCount);
  const [postCommentCount, setPostCommentCount] =
    useState<number>(commentCount);
  const [postShareCount, setPostShareCount] = useState<number>(shareCount);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // State for updated post data
  const [updatedContent, setUpdatedContent] = useState<string>(content);
  const [updatedLocation, setUpdatedLocation] = useState<string | undefined>(
    location
  );
  const [updatedPrivacy, setUpdatedPrivacy] = useState<string | undefined>(
    privacy
  );
  const [updatedTags, setUpdatedTags] = useState<string[]>(tags);
  const [updatedMediaList, setUpdatedMediaList] =
    useState<MediaItem[]>(mediaList);

  const swiperRef = useRef<SwiperType | null>(null);

  const navigate = useNavigate();

  // Debug logging
  console.log("PostModal render:", {
    isShare,
    hasSharedPost: !!sharedPost,
    sharedPost,
  });

  // Process mediaList to separate images and videos
  const imageMedia = updatedMediaList.filter((media) => media.type === "IMAGE");
  const videoMedia = updatedMediaList.filter((media) => media.type === "VIDEO");

  // Handle both single image and multiple images from mediaList
  const displayImages =
    imageMedia.length > 0
      ? imageMedia.map((media) => media.url)
      : image
      ? [image]
      : [];
  const displayVideo = videoMedia.length > 0 ? videoMedia[0].url : video;

  // Create post object for edit modal
  const currentPost: PostResponse = {
    postId,
    content: updatedContent,
    location: updatedLocation || null,
    privacy: (updatedPrivacy || "PUBLIC") as
      | "PUBLIC"
      | "FRIENDS_ONLY"
      | "PRIVATE",
    postType,
    createdAt: timeAgo, // Using timeAgo as createdAt for display
    user: {
      userId,
      fullName: userName,
      avatarImg: avatar || null,
    },
    likeCount: postLikeCount,
    commentCount: postCommentCount,
    shareCount: postShareCount,
    mediaList: updatedMediaList.map((media) => ({
      mediaId: media.url, // Using URL as temporary ID
      url: media.url,
      type: media.type,
    })),
    tags: updatedTags,
    isShare,
    sharedPost,
    group: group
      ? {
          groupId: group.groupId,
          groupName: group.groupName,
          coverImageUrl: group.coverImageUrl || null,
        }
      : null,
    liked: isLiked,
  };

  const handleUpdateSuccess = (updatedPost: PostResponse) => {
    // Update local state with new post data
    setUpdatedContent(updatedPost.content);
    setUpdatedLocation(updatedPost.location || undefined);
    setUpdatedPrivacy(updatedPost.privacy);
    setUpdatedTags(updatedPost.tags);
    setUpdatedMediaList(
      updatedPost.mediaList.map((media) => ({
        type: media.type,
        url: media.url,
      }))
    );

    toast.success("Bài viết đã được cập nhật!");

    // Call parent callback if provided to refresh data
    if (onEditPost) {
      onEditPost();
    }
  };

  const handleImageClick = (img: string, index: number) => {
    setSelectedImageIndex(index);
    if (onImageClick) {
      onImageClick(img, index);
    }
  };

  const handleComment = () => {
    setPostCommentCount((prev) => prev + 1);
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const handleShareSuccess = () => {
    setPostShareCount((prev) => prev + 1);
    onShare?.();
  };

  const handleEditPost = () => {
    setShowEditModal(true);
    setShowOptionsDropdown(false);
  };

  const handleDeletePost = () => {
    setShowDeleteConfirm(true);
    setShowOptionsDropdown(false);
  };

  const confirmDeletePost = async () => {
    try {
      await apiDeletePost(postId);
      toast.success("Xóa bài viết thành công!");
      setShowDeleteConfirm(false);

      // Call parent callback if provided
      if (onDeletePost) {
        onDeletePost();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài viết. Vui lòng thử lại!");
      throw error; // Re-throw to let ConfirmDeleteModal handle the error state
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteConfirm(false);
  };

  const handleGroupClick = () => {
    if (group?.groupId) {
      navigate(`/home/groups/${group.groupId}`);
    }
  };

  // Render header text based on postType
  const renderHeaderText = () => {
    if (postType === "AVATAR_UPDATE") {
      return (
        <span className="text-xs sm:text-sm text-gray-600">{content}</span>
      );
    }

    if (postType === "COVER_UPDATE") {
      return (
        <span className="text-xs sm:text-sm text-gray-600">{content}</span>
      );
    }

    // NORMAL post with location
    if (updatedLocation) {
      return (
        <>
          <span className="text-xs sm:text-sm text-gray-600">
            {" "}
            đã chia sẻ khoảnh khắc tại{" "}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 truncate">
            {updatedLocation}
          </span>
        </>
      );
    }

    return null;
  };

  const renderSingleImage = (img: string, index: number) => (
    <div key={index} style={{ marginBottom: "12px" }}>
      <TravelImage
        src={img}
        alt="post"
        onClick={() => handleImageClick(img, index)}
        preview={{
          mask: "Xem ảnh",
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
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          navigation={false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          className="post-swiper rounded-xl"
          style={
            {
              borderRadius: "12px",
            } as React.CSSProperties
          }
        >
          {displayImages.map((img, index) => (
            <SwiperSlide key={index}>
              <TravelImage
                src={img}
                alt={`post-${index}`}
                className="w-full"
                style={{ borderRadius: "12px" }}
                preview={{
                  mask: "Xem ảnh",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {currentImageIndex > 0 && (
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
          >
            <Icon icon="fluent:chevron-left-20-filled" className="w-5 h-5" />
          </button>
        )}

        {currentImageIndex < displayImages.length - 1 && (
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
          >
            <Icon icon="fluent:chevron-right-24-filled" className="w-5 h-5" />
          </button>
        )}

        {/* Image Counter */}
        <div className="absolute px-2 py-1 text-sm text-white bg-black bg-opacity-50 rounded-full bottom-2 right-2 z-10">
          {currentImageIndex + 1} / {displayImages.length}
        </div>
      </div>
    );
  };

  const renderTags = () => {
    if (!updatedTags || updatedTags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {updatedTags.map((tag, index) => (
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
              onClick={() => {
                console.log(userId);
                navigate(`/home/user/${userId}`);
              }}
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
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                {formatTimeAgo(timeAgo)}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">•</span>
              <Icon
                icon="fluent:globe-24-filled"
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
              <span
                className="hover:underline cursor-pointer truncate"
                onClick={() => {
                  navigate(`/home/user/${userId}`);
                }}
              >
                {userName}
              </span>
              {renderHeaderText()}
            </div>
          </div>

          {/* Menu button */}
          <div className="ml-auto flex-shrink-0 relative">
            <div className="flex items-center gap-1">
              {/* Options button */}
              <button
                className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
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

              {/* Hide post button */}
              {onHidePost && (
                <button
                  className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={onHidePost}
                  title="Ẩn bài viết"
                >
                  <Icon
                    icon="fluent:dismiss-24-filled"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
              )}
            </div>
            {showOptionsDropdown && (
              <PostOptionsDropdown
                onClose={() => setShowOptionsDropdown(false)}
                postId={postId}
                userId={userId}
                isOwner={false}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white shadow rounded-xl">
        {/* User Header Skeleton */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <Skeleton.Avatar active size={40} />
          <div className="flex-1">
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </div>
        </div>

        {/* Content Skeleton */}
        <Skeleton active paragraph={{ rows: 3 }} className="mb-3" />

        {/* Image/Video Skeleton */}
        <Skeleton.Image active style={{ width: '100%', height: 400 }} className="rounded-xl mb-3" />

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-3 sm:gap-6 pt-3 border-t border-gray-200">
          <Skeleton.Button active size="small" style={{ width: 80 }} />
          <Skeleton.Button active size="small" style={{ width: 100 }} />
          <Skeleton.Button active size="small" style={{ width: 80 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white shadow rounded-xl">
        {/* Share indicator */}
        {isShare && (
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-gray-500">
            <Icon
              icon="fluent:arrow-reply-24-filled"
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
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
              onClick={() => {
                console.log(userId);
                navigate(`/home/user/${userId}`);
              }}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <span
                  className="font-semibold text-sm sm:text-base text-gray-800 cursor-pointer hover:underline hover:text-blue-600 truncate"
                  onClick={() => {
                    navigate(`/home/user/${userId}`);
                  }}
                >
                  {userName}
                </span>
                {renderHeaderText()}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
                <span>{formatTimeAgo(timeAgo)}</span>
                <Icon icon="fluent:globe-24-filled" className="w-3 h-3 ml-1" />
                {privacy && (
                  <span className="ml-1">• {formatPrivacy(privacy)}</span>
                )}
              </div>
            </div>
            <div className="ml-auto flex-shrink-0 relative">
              <div className="flex items-center gap-1">
                {/* Options button */}
                <button
                  className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
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

                {/* Hide post button */}
                {onHidePost && (
                  <button
                    className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={onHidePost}
                    title="Ẩn bài viết"
                  >
                    <Icon
                      icon="fluent:dismiss-24-filled"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </button>
                )}
              </div>
              {showOptionsDropdown && (
                <PostOptionsDropdown
                  onClose={() => setShowOptionsDropdown(false)}
                  postId={postId}
                  userId={userId}
                  isOwner={false}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              )}
            </div>
          </div>
        )}

        {/* Content with expandable functionality */}
        {postType === "NORMAL" && (
          <ExpandableContent
            content={updatedContent}
            maxLines={3}
            className="text-sm sm:text-base leading-relaxed break-words"
          />
        )}

        {/* Tags */}
        {renderTags()}

        {/* Shared Post Preview - Only show if this is a share post */}
        {isShare && sharedPost && (
          <SharedPostPreview
            sharedPost={sharedPost}
            onImageClick={handleImageClick}
          />
        )}

        {/* Media rendering logic - Only show if NOT a share post */}
        {!isShare && displayVideo && renderVideo(displayVideo)}
        {!isShare && displayImages.length > 0 && renderImageSlider()}

        {/* Action buttons */}
        <div className="flex items-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm text-black">
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
            postId={postId}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            likeCount={postLikeCount}
            setLikeCount={setPostLikeCount}
          />
          <div
            className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-500"
            onClick={openCommentModal}
          >
            <Icon
              icon="fluent:chat-24-filled"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span>
              Bình luận {postCommentCount > 0 && `(${postCommentCount})`}
            </span>
          </div>
          <div
            className="flex items-center gap-1 transition-colors cursor-pointer hover:text-green-500"
            onClick={handleShareClick}
          >
            <Icon
              icon="fluent:arrow-reply-24-filled"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span>Chia sẻ {postShareCount > 0 && `(${postShareCount})`}</span>
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

      {/* Post Detail Modal */}
      <PostDetailModal
        isOpen={showCommentModal}
        onClose={closeCommentModal}
        postId={postId}
        userId={userId}
        avatar={avatar}
        userName={userName}
        location={updatedLocation}
        timeAgo={timeAgo}
        content={updatedContent}
        displayImages={displayImages}
        displayVideo={displayVideo}
        selectedImageIndex={selectedImageIndex}
        postLikeCount={postLikeCount}
        setPostLikeCount={setPostLikeCount}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        postCommentCount={postCommentCount}
        handleComment={handleComment}
        onCommentCountChange={handleComment}
        currentUserAvatar={currentUserAvatar}
        tags={updatedTags}
        isShare={isShare}
        privacy={updatedPrivacy}
        group={group}
        postShareCount={postShareCount}
        onShare={handleShareClick}
        sharedPost={sharedPost}
        postType={postType}
      />

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={showShareModal}
        onClose={closeShareModal}
        postId={postId}
        originalPostContent={updatedContent}
        originalPostAuthor={userName}
        originalPostAuthorId={userId}
        originalPostImages={displayImages}
        currentUserAvatar={currentUserAvatar}
        currentUserName={currentUserName}
        onShareSuccess={handleShareSuccess}
      />

      {/* Edit Post Modal */}
      <PostEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={currentPost}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        type="post"
        itemName={
          updatedContent.slice(0, 50) +
          (updatedContent.length > 50 ? "..." : "")
        }
      />
    </>
  );
};

export default PostModal;
