import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import avatardf from "../../../assets/images/avatar_default.png";
import { message } from "antd";
import { apiSharePost } from "../../../services/postService";
import { TiptapEditor, ExpandableContent } from "../../ui";
import { PrivacyDropdown } from "../../common/dropdowns";
import TravelButton from "../../ui/customize/TravelButton";
import { LoadingSpinner } from "../../ui/loading";

interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  originalPostContent?: string;
  originalPostAuthor?: string;
  originalPostAuthorId?: string;
  originalPostImages?: string[];
  currentUserAvatar?: string;
  currentUserName?: string;
  onShareSuccess?: () => void;
}

const SharePostModal: React.FC<SharePostModalProps> = ({
  isOpen,
  onClose,
  postId,
  originalPostContent = "",
  originalPostAuthor = "",
  originalPostAuthorId = "",
  originalPostImages = [],
  currentUserAvatar,
  currentUserName = "Bạn",
  onShareSuccess,
}) => {
  const [shareContent, setShareContent] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>("public");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Privacy options
  const privacyOptions: PrivacyOption[] = [
    {
      value: "public",
      label: "Công khai",
      icon: () => (
        <Icon
          icon="fluent:globe-24-filled"
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
        />
      ),
      description: "Bất kỳ ai cũng có thể nhìn thấy",
    },
    {
      value: "friends",
      label: "Bạn bè",
      icon: () => (
        <Icon
          icon="fluent:people-24-filled"
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
        />
      ),
      description: "Chỉ bạn bè của bạn có thể nhìn thấy",
    },
    {
      value: "private",
      label: "Chỉ mình tôi",
      icon: () => (
        <Icon
          icon="fluent:lock-closed-24-filled"
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
        />
      ),
      description: "Chỉ bạn có thể nhìn thấy",
    },
  ];

  const handleShare = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Map privacy values to match API expectations
      const privacyMap: {
        [key: string]: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";
      } = {
        public: "PUBLIC",
        friends: "FRIENDS_ONLY",
        private: "PRIVATE",
      };

      const response = await apiSharePost(postId, {
        content: shareContent,
        privacy: privacyMap[privacy] || "PUBLIC",
      });

      if (response.success) {
        message.success("Đã chia sẻ bài viết!");
        onShareSuccess?.();
        onClose();
        setShareContent("");
      } else {
        message.error("Không thể chia sẻ bài viết. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      message.error("Không thể chia sẻ bài viết. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1100]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start pr-8">
            <span className="flex items-center mb-1 text-base sm:text-lg font-bold text-blue-600">
              <Icon
                icon="fluent:compass-northwest-24-regular"
                className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6"
              />
              TravelNest
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Chia sẻ bài viết
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block">
              Chia sẻ bài viết này với bạn bè của bạn
            </p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-4 sm:right-5 top-4 sm:top-5 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info & Privacy */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={currentUserAvatar || avatardf}
              alt="avatar"
              className="object-cover w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{currentUserName}</p>
              <div className="h-10 w-[160px]">
                <PrivacyDropdown
                  value={privacy}
                  onChange={setPrivacy}
                  options={privacyOptions}
                />
              </div>
            </div>
          </div>

          {/* Share Input */}
          <div className="mb-4">
            <TiptapEditor
              content={shareContent}
              onChange={setShareContent}
              placeholder="Bạn nghĩ gì về bài viết này?"
              maxLength={2000}
            />
          </div>

          {/* Original Post Preview */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="fluent:arrow-reply-24-filled"
                className="w-4 h-4 text-gray-500"
              />
              <span className="text-sm text-gray-700">
                Bài viết của{" "}
                <span
                  onClick={() => {
                    if (originalPostAuthorId) {
                      navigate(`/home/user/${originalPostAuthorId}`);
                    }
                  }}
                  className="font-semibold text-blue-600 underline cursor-pointer hover:text-blue-700 transition-colors"
                >
                  @{originalPostAuthor}
                </span>
              </span>
            </div>

            {/* Original Content */}
            {originalPostContent && (
              <ExpandableContent
                content={originalPostContent}
                maxLines={3}
                className="mb-3 text-sm text-gray-600"
              />
            )}

            {/* Original Images Preview */}
            {originalPostImages.length > 0 && (
              <div
                className={`grid gap-2 ${
                  originalPostImages.length === 1
                    ? "grid-cols-1"
                    : originalPostImages.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2"
                }`}
              >
                {originalPostImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-[300px] overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`preview-${idx}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                    {idx === 3 && originalPostImages.length > 4 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <span className="text-2xl font-bold text-white">
                          +{originalPostImages.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
          <div className="flex justify-end">
            <TravelButton
              type="default"
              onClick={handleShare}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="px-6 !bg-gray-100 hover:!bg-gray-200 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size={16} color="#374151" />
                  <span>Đang chia sẻ...</span>
                </div>
              ) : (
                "Chia sẻ ngay"
              )}
            </TravelButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
