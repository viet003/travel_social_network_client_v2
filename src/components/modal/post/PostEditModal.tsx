import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import TiptapEditor from "../../ui/TiptapEditor";
import { PrivacyDropdown } from "../../common/dropdowns";
import LocationDropdown from "../../common/inputs/LocationDropdown";
import TravelButton from "../../ui/customize/TravelButton";
import { LoadingSpinner } from "../../ui/loading";
import { apiUpdatePost } from "../../../services/postService";
import type { PostResponse } from "../../../types/post.types";
import "../../../styles/tiptap-editor.css";

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostResponse;
  onUpdateSuccess?: (updatedPost: PostResponse) => void;
}

const PostEditModal: React.FC<PostEditModalProps> = ({
  isOpen,
  onClose,
  post,
  onUpdateSuccess,
}) => {
  const [postContent, setPostContent] = useState<string>(post.content || "");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    post.location || null
  );
  const [privacy, setPrivacy] = useState<string>(
    post.privacy?.toLowerCase() || "public"
  );
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState<boolean>(false);

  const privacyOptions = [
    {
      value: "public",
      label: "Công khai",
      icon: () => <Icon icon="fluent:globe-24-filled" className="w-4 h-4" />,
      description: "Mọi người đều có thể xem bài viết này",
    },
    {
      value: "friend",
      label: "Bạn bè",
      icon: () => <Icon icon="fluent:people-24-filled" className="w-4 h-4" />,
      description: "Chỉ bạn bè có thể xem",
    },
    {
      value: "private",
      label: "Riêng tư",
      icon: () => (
        <Icon icon="fluent:lock-closed-24-filled" className="w-4 h-4" />
      ),
      description: "Chỉ mình tôi",
    },
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPostContent(post.content || "");
      setSelectedLocation(post.location || null);
      setPrivacy(post.privacy?.toLowerCase() || "public");
      setTags(post.tags || []);
      setTagInput("");
      setShowTagInput(false);
    }
  }, [isOpen, post]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) {
      toast.error("Tag không được để trống!");
      return;
    }

    if (trimmedTag.length > 20) {
      toast.error("Tag không được vượt quá 20 ký tự!");
      return;
    }

    if (tags.includes(trimmedTag)) {
      toast.error("Tag này đã tồn tại!");
      return;
    }

    if (tags.length >= 10) {
      toast.error("Không thể thêm quá 10 tags!");
      return;
    }

    setTags([...tags, trimmedTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleUpdatePost = async () => {
    const trimmedContent = postContent.trim();

    if (!trimmedContent) {
      toast.error("Nội dung bài viết không được để trống!");
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("content", trimmedContent);
      formData.append("privacy", privacy.toUpperCase());
      formData.append("postType", "NORMAL");

      if (selectedLocation) {
        formData.append("location", selectedLocation);
      }

      // Add tags
      if (tags.length > 0) {
        tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }

      const response = await apiUpdatePost(post.postId, formData);

      toast.success("Cập nhật bài viết thành công!");

      if (onUpdateSuccess && response.data) {
        onUpdateSuccess(response.data);
      }

      onClose();
    } catch (error: unknown) {
      console.error("Error updating post:", error);

      if (error && typeof error === "object" && "message" in error) {
        toast.error(
          `Không thể cập nhật bài viết: ${
            (error as { message: string }).message
          }`
        );
      } else {
        toast.error("Không thể cập nhật bài viết. Vui lòng thử lại!");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-[100vh] flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50 px-4"
      style={{ zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
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
              Chỉnh Sửa Bài Viết
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block">
              Cập nhật nội dung và thông tin bài viết của bạn
            </p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-4 sm:right-5 top-4 sm:top-5 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          {/* Privacy & Location */}
          <div className="flex items-center gap-2 flex-wrap">
            <LocationDropdown
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Thêm địa điểm..."
              type={true}
            />
            <PrivacyDropdown
              value={privacy}
              onChange={setPrivacy}
              options={privacyOptions}
            />
          </div>

          {/* Content Input with Tiptap Editor */}
          <div>
            <label className="block mb-2 text-xs font-medium text-gray-700">
              Nội dung bài viết
            </label>
            <TiptapEditor
              content={postContent}
              onChange={setPostContent}
              placeholder="Hôm nay bạn muốn chia sẻ điều gì?"
              maxLength={2000}
            />
          </div>

          {/* Tags Section */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thẻ{" "}
              <span className="text-xs text-gray-500">
                (Tùy chọn, tối đa 10)
              </span>
            </label>

            {/* Display existing tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
                  >
                    <Icon
                      icon="fluent:number-symbol-24-filled"
                      className="w-3 h-3"
                    />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                      aria-label={`Xóa thẻ ${tag}`}
                    >
                      <Icon
                        icon="fluent:dismiss-12-filled"
                        className="w-3 h-3"
                      />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag input */}
            {showTagInput ? (
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="relative flex-1">
                  <Icon
                    icon="fluent:hash-24-filled"
                    className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Nhập thẻ và nhấn Enter..."
                    className="w-full py-2 pr-4 border border-gray-300 rounded-full pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Icon icon="fluent:add-24-filled" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setTagInput("");
                  }}
                  className="px-3 py-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
                >
                  <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                disabled={tags.length >= 10}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                <Icon
                  icon="fluent:number-symbol-24-filled"
                  className="w-4 h-4"
                />
                Thêm Thẻ ({tags.length}/10)
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <span className="block mb-3 text-sm font-medium text-gray-700">
              Thao tác nhanh
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 text-blue-500 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Gắn thẻ người"
              >
                <Icon icon="fluent:people-24-filled" className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 text-yellow-500 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Thêm cảm xúc/hoạt động"
              >
                <Icon icon="fluent:emoji-24-filled" className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowTagInput(!showTagInput)}
                className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer ${
                  showTagInput
                    ? "text-purple-600 bg-purple-100"
                    : "text-purple-500"
                }`}
                aria-label="Thêm thẻ"
              >
                <Icon
                  icon="fluent:number-symbol-24-filled"
                  className="w-5 h-5"
                />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 text-blue-400 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Thêm GIF"
              >
                <span className="text-xs font-bold">GIF</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Tùy chọn khác"
              >
                <Icon
                  icon="fluent:more-horizontal-24-filled"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <TravelButton
                type="primary"
                onClick={handleUpdatePost}
                loading={isUpdating}
                disabled={isUpdating || !postContent.trim()}
                className="px-6"
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size={16} color="#374151" />
                    <span>Đang cập nhật...</span>
                  </div>
                ) : (
                  "Cập Nhật Bài Viết"
                )}
              </TravelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditModal;
