import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { PrivacyDropdown } from '../../common/dropdowns';
import { TravelInput, TravelButton } from '../../ui/customize';
import avatardf from '../../../assets/images/avatar_default.png';
import { toast } from 'react-toastify';
import { apiCreateGroup } from '../../../services/groupService';
import { LoadingSpinner } from '../../ui/loading';

// Types
interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface GroupCreateModalProps {
  setCreateSuccess?: (success: boolean) => void;
}

interface AuthState {
  userId: string;
  avatar: string | null;
  fullName: string;
}

const GroupCreateModal: React.FC<GroupCreateModalProps> = ({ setCreateSuccess }) => {
  const { avatar, fullName } = useSelector((state: { auth: AuthState }) => state.auth);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<string>("public");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>("");

  // Predefined tags
  const predefinedTags = ["Phượt", "Review", "Ẩm thực", "Camping"];

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

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setGroupName("");
    setDescription("");
    setSelectedImage(null);
    setPrivacy("public");
    setSelectedTags([]);
    setCustomTag("");
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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error('Vui lòng nhập tên nhóm!');
      return;
    }

    if (groupName.trim().length < 3) {
      toast.error('Tên nhóm phải có ít nhất 3 ký tự!');
      return;
    }

    setIsCreating(true);

    try {
      // Server expects boolean privacy: true -> private, false -> public
      const privacyBool = privacy === 'private';

      // Combine selected tags and custom tag
      const allTags = [...selectedTags];
      if (customTag.trim()) {
        allTags.push(customTag.trim());
      }
      const tagsString = allTags.length > 0 ? allTags.join(', ') : undefined;

      const response = await apiCreateGroup({
        name: groupName.trim(),
        description: description.trim(),
        privacy: privacyBool,
        cover: selectedImage?.file,
        tags: tagsString
      });

      if (response && response.success) {
        toast.success('Tạo nhóm thành công!');
        const groupId = response.data?.groupId;
        handleClose();
        
        if (setCreateSuccess) setCreateSuccess(true);
        
        // Redirect to group detail page if we have groupId
        if (groupId) {
          navigate(`/home/groups/${groupId}`, { replace: true });
        }
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tạo nhóm:', err);
      toast.error('Lỗi khi tạo nhóm');
    } finally {
      setIsCreating(false);
    }
  };

  // Get current privacy option details
  const currentPrivacy = privacyOptions.find(option => option.value === privacy);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-center space-x-2 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
      >
        <Icon icon="fluent:add-24-filled" className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-[15px] text-blue-600">Tạo nhóm mới</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50"
          style={{ zIndex: 1000 }}
          onClick={handleClose}
        >
          <div
            className="relative w-full h-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col items-start pr-8">
                <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
                  <Icon icon="fluent:compass-northwest-24-regular" className="text-blue-600 w-7 h-7" />
                  TravelNest
                </span>
                <h2 className="text-2xl font-bold text-gray-800">Tạo Nhóm Mới</h2>
                <p className="text-sm text-gray-500">Tạo nhóm để kết nối với những người có cùng sở thích</p>
              </div>
              <button
                className="absolute flex items-center justify-center w-10 h-10 text-gray-600 rounded-full bg-gray-100 right-6 top-6 hover:bg-gray-300 cursor-pointer"
                onClick={handleClose}
                aria-label="Đóng"
              >
                <Icon icon="fluent:dismiss-24-filled" className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6 max-w-3xl mx-auto">
              {/* User Profile Section */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                  <img
                    src={`${avatar !== null ? avatar : avatardf}`}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-base font-semibold text-gray-800 truncate">
                    {fullName}
                  </span>
                  <span className="text-sm text-gray-500">Người tạo nhóm</span>
         
                </div>
              </div>

              {/* Privacy Info */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
                <Icon icon="fluent:info-24-filled" className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-blue-700">
                  <strong>{currentPrivacy?.label}:</strong> {currentPrivacy?.description}
                </span>
              </div>

              {/* Group Name Input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên nhóm <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Nhập tên nhóm..."
                  maxLength={100}
                  required
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Tối thiểu 3 ký tự</span>
                  <span className="text-xs text-gray-500">{groupName.length}/100</span>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mô tả <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả về nhóm của bạn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">{description.length}/500</span>
                </div>
              </div>

              {/* Privacy Selector */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Quyền riêng tư
                </label>
                <PrivacyDropdown
                  value={privacy}
                  onChange={setPrivacy}
                  options={privacyOptions}
                />
              </div>

              {/* Tags Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Thể loại nhóm <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-blue-500 hover:bg-gray-200'
                      }`}
                    >
                      {selectedTags.includes(tag) && (
                        <Icon icon="fluent:checkmark-24-filled" className="inline w-4 h-4 mr-1" />
                      )}
                      #{tag}
                    </button>
                  ))}
                </div>
                <TravelInput
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Hoặc nhập thể loại khác..."
                  maxLength={50}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  {selectedTags.length > 0 && `Đã chọn: ${selectedTags.join(', ')}`}
                  {selectedTags.length > 0 && customTag.trim() && ' + '}
                  {customTag.trim()}
                </span>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Ảnh nhóm <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>

                {selectedImage ? (
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden group">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute hover:text-white hover:bg-gray-700 flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full z-10 top-2 right-2 bg-opacity-70 hover:bg-opacity-90 cursor-pointer transition-all"
                    >
                      <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4" />
                    </button>
                    <img
                      src={selectedImage.preview}
                      alt="Group preview"
                      className="object-cover w-full"
                    />
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label>
                        <TravelButton
                          type="default"
                          className="flex items-center hover:!bg-gray-200 gap-2 !cursor-pointer"
                        >
                          <Icon icon="fluent:camera-24-filled" className="w-4 h-4" />
                          Thay đổi ảnh
                        </TravelButton>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                    <div className="flex flex-col items-center py-8">
                      <Icon icon="fluent:image-24-filled" className="w-12 h-12 mb-4 text-gray-400" />
                      <span className="mb-2 text-sm font-medium text-gray-600">Tải lên Ảnh Nhóm</span>
                      <span className="text-xs text-center text-gray-500">
                        Nhấp để duyệt hoặc kéo thả<br />
                        JPG, PNG, GIF, WEBP • Tối đa 5MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <TravelButton
                    type="primary"
                    htmlType="submit"
                    disabled={isCreating || !groupName.trim() || groupName.trim().length < 3}
                    loading={isCreating}
                    className="px-6 transition-colors"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size={16} color="#374151" />
                        <span>Đang tạo nhóm...</span>
                      </div>
                    ) : (
                      "Tạo Nhóm"
                    )}
                  </TravelButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCreateModal;
