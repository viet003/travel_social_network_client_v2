import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { ExpandableContent, TravelImage } from "../../ui";
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import avatardf from "../../../assets/images/avatar_default.png";
import type { PostResponse } from "../../../types/post.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "../../../styles/post-modal.css";

interface SharedPostPreviewProps {
  sharedPost: PostResponse;
  onImageClick?: (img: string, index: number) => void;
}

const SharedPostPreview: React.FC<SharedPostPreviewProps> = ({
  sharedPost,
  onImageClick,
}) => {
  const navigate = useNavigate();

  if (!sharedPost || !sharedPost.user) return null;

  const sharedImages =
    sharedPost.mediaList?.filter((m) => m.type === "IMAGE").map((m) => m.url) ||
    [];
  const sharedVideo = sharedPost.mediaList?.find(
    (m) => m.type === "VIDEO"
  )?.url;

  const handleImageClick = (img: string, index: number) => {
    if (onImageClick) {
      onImageClick(img, index);
    }
  };

  const handleGroupClick = () => {
    if (sharedPost.group?.groupId) {
      navigate(`/home/groups/${sharedPost.group.groupId}`);
    }
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
    if (sharedImages.length === 0) return null;

    if (sharedImages.length === 1) {
      return renderSingleImage(sharedImages[0], 0);
    }

    return (
      <div className="relative mb-3">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="post-swiper rounded-xl"
          style={
            {
              borderRadius: "12px",
              "--swiper-navigation-size": "20px",
            } as React.CSSProperties
          }
        >
          {sharedImages.map((img, index) => (
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
      </div>
    );
  };

  const renderTags = () => {
    if (!sharedPost.tags || sharedPost.tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {sharedPost.tags.map((tag, index) => (
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
    if (!sharedPost.group) return null;

    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2">
          {/* Group Cover with Avatar Overlay */}
          <div className="relative flex-shrink-0">
            <img
              src={sharedPost.group.coverImageUrl || avatardf}
              alt={sharedPost.group.groupName}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
            />
            {/* User Avatar Overlay */}
            <img
              src={sharedPost.user?.avatarImg || avatardf}
              alt="avatar"
              className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-full border-2 border-white cursor-pointer"
              onClick={() => navigate(`/home/user/${sharedPost.user?.userId}`)}
            />
          </div>

          {/* Group and User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span
                className="font-semibold text-sm sm:text-base text-gray-800 hover:underline cursor-pointer truncate"
                onClick={handleGroupClick}
              >
                {sharedPost.group.groupName}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">•</span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                {formatTimeAgo(sharedPost.createdAt)}
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
                onClick={() =>
                  navigate(`/home/user/${sharedPost.user?.userId}`)
                }
              >
                {sharedPost.user?.fullName}
              </span>
              {sharedPost.location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 truncate">
                    {sharedPost.location}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Menu button */}
          <div className="ml-auto flex-shrink-0 relative">
            <button className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors">
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-3 sm:p-4 mb-3 border-2 border-gray-200 rounded-xl bg-gray-50">
      {/* Group Header - Only show if group exists */}
      {renderGroupHeader()}

      {/* User info for non-group posts only */}
      {!sharedPost.group && (
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <img
            src={sharedPost.user?.avatarImg || avatardf}
            alt="avatar"
            className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer flex-shrink-0"
            onClick={() => navigate(`/home/user/${sharedPost.user?.userId}`)}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span
                className="font-semibold text-sm sm:text-base text-gray-800 cursor-pointer hover:underline hover:text-blue-600 truncate"
                onClick={() =>
                  navigate(`/home/user/${sharedPost.user?.userId}`)
                }
              >
                {sharedPost.user?.fullName}
              </span>
              {sharedPost.location && (
                <>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {" "}
                    đã chia sẻ khoảnh khắc tại{" "}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 truncate">
                    {sharedPost.location}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              <span>{formatTimeAgo(sharedPost.createdAt)}</span>
              <Icon icon="fluent:globe-24-filled" className="w-3 h-3 ml-1" />
              {sharedPost.privacy && (
                <span className="ml-1">
                  • {formatPrivacy(sharedPost.privacy)}
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto flex-shrink-0 relative">
            <button className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
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
          </div>
        </div>
      )}

      {/* Content with expandable functionality */}
      <ExpandableContent
        content={sharedPost.content}
        maxLines={3}
        className="text-sm sm:text-base leading-relaxed break-words"
      />

      {/* Tags */}
      {renderTags()}

      {/* Media rendering */}
      {sharedVideo && renderVideo(sharedVideo)}
      {sharedImages.length > 0 && renderImageSlider()}

      {/* Stats */}
      <div className="flex items-center gap-3 sm:gap-6 pt-3 text-xs sm:text-sm text-gray-500 border-t border-gray-200 mt-3">
        <div className="flex items-center gap-1">
          <Icon
            icon="fluent:heart-24-regular"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>{sharedPost.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon
            icon="fluent:chat-24-filled"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>{sharedPost.commentCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon
            icon="fluent:arrow-reply-24-filled"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <span>{sharedPost.shareCount}</span>
        </div>
      </div>
    </div>
  );
};

export default SharedPostPreview;
