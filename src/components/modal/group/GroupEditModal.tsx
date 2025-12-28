import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { PrivacyDropdown } from '../../common/dropdowns';
import { TravelInput, TravelButton } from '../../ui/customize';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../ui/loading';

// Types
interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface GroupEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    description: string;
    privacy: boolean;
    coverImage?: File;
  }) => Promise<void>;
  initialValues?: {
    groupName?: string;
    groupDescription?: string;
    privacy?: boolean;
    coverImageUrl?: string;
  };
}

const GroupEditModal: React.FC<GroupEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues = {}
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>("public");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string>("");

  // Privacy options
  const privacyOptions: PrivacyOption[] = [
    {
      value: "public",
      label: "Công khai",
      icon: () => <Icon icon="fluent:globe-24-filled" className="w-4 h-4" />,
      description: "Mọi người đều có thể tìm thấy và tham gia nhóm này"
    },
    {
      value: "private",
      label: "Riêng tư",
      icon: () => <Icon icon="fluent:lock-closed-24-filled" className="w-4 h-4" />,
      description: "Chỉ thành viên mới có thể xem bài viết trong nhóm"
    }
  ];

  // Load initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setGroupName(initialValues.groupName || "");
      setDescription(initialValues.groupDescription || "");
      setPrivacy(initialValues.privacy ? "private" : "public");
      setCurrentCoverUrl(initialValues.coverImageUrl || "");
      setSelectedImage(null);
    }
  }, [isOpen, initialValues]);

  const handleClose = () => {
    setGroupName("");
    setDescription("");
    setPrivacy("public");
    setSelectedImage(null);
    setCurrentCoverUrl("");
    onClose();
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Tệp quá lớn! Vui lòng chọn tệp nhỏ hơn 5MB.');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ tệp hình ảnh (JPEG, PNG, GIF, WEBP)!');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage({
        file: file,
        preview: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!groupName.trim()) {
      toast.error('Vui lòng nhập tên nhóm!');
      return;
    }

    if (groupName.length > 100) {
      toast.error('Tên nhóm không được vượt quá 100 ký tự!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: groupName.trim(),
        description: description.trim(),
        privacy: privacy === "private",
        coverImage: selectedImage?.file
      });
      handleClose();
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Không thể cập nhật nhóm. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const displayCoverImage = selectedImage?.preview || currentCoverUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out bg-black/50"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon icon="mdi:compass" className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa nhóm</h2>
            <p className="text-sm text-gray-500">Cập nhật thông tin và cài đặt nhóm của bạn</p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Ảnh bìa nhóm</h3>
            <div className="relative group">
              <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={displayCoverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Icon icon="lucide:camera" className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {selectedImage || currentCoverUrl ? 'Thay đổi ảnh' : 'Thêm ảnh'}
                      </span>
                    </div>
                  </label>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                      <span className="text-sm font-medium">Xóa ảnh mới</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Kích thước khuyến nghị: 1200x400px. Tệp tối đa: 5MB
              </p>
            </div>
          </div>

          {/* Group Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin nhóm</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên nhóm <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  placeholder="Nhập tên nhóm..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {groupName.length}/100 ký tự
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mô tả nhóm <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả về nhóm của bạn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {description.length}/500 ký tự
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Cài đặt quyền riêng tư</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quyền riêng tư
              </label>
              <PrivacyDropdown
                options={privacyOptions}
                value={privacy}
                onChange={setPrivacy}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <TravelButton
                type="default"
                htmlType="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 !bg-gray-100 hover:!bg-gray-200 transition-colors cursor-pointer"
              >
                Hủy
              </TravelButton>
              <TravelButton
                type="primary"
                htmlType="submit"
                disabled={isSubmitting || !groupName.trim()}
                loading={isSubmitting}
                className="px-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size={16} color="#ffffff" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  "Lưu thay đổi"
                )}
              </TravelButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupEditModal;
