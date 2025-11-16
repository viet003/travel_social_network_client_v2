import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LocationDropdown from "../../../components/common/inputs/LocationDropdown";
import TiptapEditor from "../../../components/ui/TiptapEditor";
import TravelButton from "../../../components/ui/customize/TravelButton";
import TravelSelect from "../../../components/ui/customize/TravelSelect";
import TravelInput from "../../../components/ui/customize/TravelInput";
import { LoadingSpinner } from "../../../components/ui/loading";
import avatardf from "../../../assets/images/avatar_default.png";
import type { BlogStatus } from "../../../types/blog.types";
import { apiGetBlogById } from "../../../services/blogService";
import "../../../styles/tiptap-editor.css";

// Types
interface StatusOption {
  value: BlogStatus;
  label: string;
  icon: string;
  description: string;
  color: string;
}

interface AuthState {
  userId: string;
  avatar: string | null;
}

const BlogCreateEditPage: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const isEditMode = !!blogId;
  
  const { avatar } = useSelector(
    (state: { auth: AuthState }) => state.auth
  );

  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [status, setStatus] = useState<BlogStatus>("DRAFT");
  const [readingTime, setReadingTime] = useState<number | undefined>(undefined);
  
  // Media and tags
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]); // Track media IDs from content
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Status options
  const statusOptions: StatusOption[] = [
    {
      value: "DRAFT",
      label: "Bản nháp",
      icon: "fluent:document-edit-24-filled",
      description: "Lưu để chỉnh sửa sau",
      color: "text-gray-600",
    },
    {
      value: "PUBLISHED",
      label: "Xuất bản",
      icon: "fluent:globe-24-filled",
      description: "Hiển thị công khai",
      color: "text-green-600",
    },
    {
      value: "PENDING",
      label: "Chờ duyệt",
      icon: "fluent:clock-24-filled",
      description: "Đang chờ phê duyệt",
      color: "text-yellow-600",
    },
  ];

  const currentStatus = statusOptions.find((option) => option.value === status);

  const loadBlogData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiGetBlogById(id);
      const blog = response.data;
      
      setTitle(blog.title);
      setDescription(blog.description || "");
      setContent(blog.content);
      setThumbnailUrl(blog.thumbnailUrl || "");
      setSelectedLocation(blog.location || null);
      setStatus(blog.status);
      setReadingTime(blog.readingTime);
      
      // Set tags
      if (blog.tags && blog.tags.length > 0) {
        setTags(blog.tags.map((tag: { title: string }) => tag.title));
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      toast.error("Không thể tải dữ liệu blog");
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Load blog data if editing
  useEffect(() => {
    if (isEditMode && blogId) {
      loadBlogData(blogId);
    }
  }, [isEditMode, blogId, loadBlogData]);

  // Calculate reading time based on content
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/minute
      setReadingTime(minutes);
    }
  }, [content]);

  // Tag handling functions
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;
    if (trimmedTag.length > 30) {
      toast.error("Thẻ không được vượt quá 30 ký tự");
      return;
    }
    if (tags.includes(trimmedTag)) {
      toast.error("Thẻ này đã tồn tại");
      return;
    }
    if (tags.length >= 10) {
      toast.error("Tối đa 10 thẻ");
      return;
    }

    setTags([...tags, trimmedTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };



  // Thumbnail handling
  const handleThumbnailSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh bìa quá lớn! Vui lòng chọn tệp nhỏ hơn 5MB.");
      return;
    }

    // Store file for upload and create preview
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailUrl("");
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề blog!");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung blog!");
      return;
    }

    if (title.length > 200) {
      toast.error("Tiêu đề không được vượt quá 200 ký tự!");
      return;
    }

    if (description && description.length > 500) {
      toast.error("Mô tả không được vượt quá 500 ký tự!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to send file + data
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      if (selectedLocation) {
        formData.append('location', selectedLocation);
      }
      formData.append('status', status);
      if (readingTime) {
        formData.append('readingTime', readingTime.toString());
      }
      
      // Add thumbnail file (if selected) or existing URL for edit mode
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (isEditMode && thumbnailUrl) {
        // If editing and no new file, send existing URL
        formData.append('thumbnailUrl', thumbnailUrl);
      }
      
      // Add tags
      if (tags.length > 0) {
        tags.forEach(tag => {
          formData.append('tagTitles', tag);
        });
      }
      
      // Add media IDs from content editor
      if (uploadedMediaIds.length > 0) {
        uploadedMediaIds.forEach(mediaId => {
          formData.append('mediaIds', mediaId);
        });
      }

      let response;
      if (isEditMode && blogId) {
        const { apiUpdateBlogWithFormData } = await import('../../../services/blogService');
        response = await apiUpdateBlogWithFormData(blogId, formData);
      } else {
        const { apiCreateBlogWithFormData } = await import('../../../services/blogService');
        response = await apiCreateBlogWithFormData(formData);
      }

      toast.success(
        isEditMode ? "Cập nhật blog thành công!" : "Tạo blog thành công!"
      );
      
      // Navigate to blog detail page
      if (response.data && response.data.blogId) {
        navigate(`/home/blog/${response.data.blogId}`);
      } else {
        navigate(-1);
      }
    } catch (error: unknown) {
      console.error("Error submitting blog:", error);
      const errorMessage = (error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : null) || (isEditMode ? "Không thể cập nhật blog" : "Không thể tạo blog");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      title ||
      description ||
      content ||
      tags.length > 0 ||
      thumbnailFile
    ) {
      if (
        window.confirm(
          "Bạn có chắc chắn muốn hủy? Mọi thay đổi chưa lưu sẽ bị mất."
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center cursor-pointer justify-center w-10 h-10 text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Icon icon="fluent:arrow-left-24-filled" className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    icon="fluent:compass-northwest-24-regular"
                    className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <span className="text-base sm:text-lg font-bold text-blue-600">
                    TravelNest
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {isEditMode ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
                </h1>
                <p className="text-sm text-gray-500">
                  Chia sẻ trải nghiệm du lịch của bạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={avatar || avatardf}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Trạng thái:
              </label>
              <TravelSelect
                value={status}
                onChange={(value) => setStatus(value as BlogStatus)}
                options={statusOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                className="!w-[180px]"
              />
              {currentStatus && (
                <span className={`text-xs ${currentStatus.color} whitespace-nowrap hidden sm:inline`}>
                  {currentStatus.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <TravelInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề blog của bạn..."
              maxLength={200}
              className="!text-lg !font-semibold"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Tiêu đề hấp dẫn giúp thu hút nhiều người đọc hơn
              </span>
              <span className="text-xs text-gray-500">
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Ảnh bìa
            </label>
            {thumbnailUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full bg-opacity-70 hover:bg-opacity-90"
                >
                  <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                <div className="flex flex-col items-center py-8">
                  <Icon
                    icon="fluent:image-24-filled"
                    className="w-12 h-12 mb-4 text-gray-400"
                  />
                  <span className="mb-2 text-sm font-medium text-gray-600">
                    Tải lên ảnh bìa
                  </span>
                  <span className="text-xs text-gray-500">
                    JPG, PNG, GIF • Tối đa 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailSelect}
                />
              </label>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mô tả ngắn
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Viết mô tả ngắn gọn về blog của bạn..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                Mô tả sẽ hiển thị trong danh sách blog
              </span>
              <span className="text-xs text-gray-500">
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              onMediaUpload={(mediaId) => {
                // Track uploaded media IDs for linking with blog later
                setUploadedMediaIds(prev => [...prev, mediaId]);
              }}
              placeholder="Kể câu chuyện du lịch của bạn..."
              maxLength={50000}
              className="!min-h-[400px]"
            />
            {readingTime && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Icon icon="fluent:clock-24-filled" className="w-4 h-4" />
                <span>Thời gian đọc: ~{readingTime} phút</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Địa điểm
            </label>
            <LocationDropdown
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Thêm địa điểm..."
              type={false}
            />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thẻ <span className="text-xs text-gray-500">(Tối đa 10)</span>
            </label>

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
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
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

            {showTagInput ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TravelInput
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Nhập thẻ và nhấn Enter..."
                    maxLength={30}
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 10}
                  className="px-3 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Icon icon="fluent:add-24-filled" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setTagInput("");
                  }}
                  className="px-3 py-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                disabled={tags.length >= 10}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <Icon
                  icon="fluent:number-symbol-24-filled"
                  className="w-4 h-4"
                />
                Thêm Thẻ ({tags.length}/10)
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex justify-end gap-3">
              <TravelButton
                type="default"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6"
              >
                Hủy
              </TravelButton>
              <TravelButton
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size={16} color="#374151" />
                    <span>
                      {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
                    </span>
                  </div>
                ) : isEditMode ? (
                  "Cập nhật Blog"
                ) : (
                  "Tạo Blog"
                )}
              </TravelButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreateEditPage;
