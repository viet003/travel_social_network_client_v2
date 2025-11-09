import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import LocationDropdown from "../../common/inputs/LocationDropdown";
import { PrivacyDropdown } from '../../common/dropdowns';
import { TravelButton } from '../../ui/customize';
import avatardf from '../../../assets/images/avatar_default.png'
import { toast } from 'react-toastify';

// Types
interface VideoFile {
  file: File;
  preview: string;
  duration: number;
  size: number;
}

interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface VideoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AuthState {
  userId: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
}

const VideoCreateModal: React.FC<VideoCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { avatar, firstName, lastName } = useSelector((state: { auth: AuthState }) => state.auth);

  // Video metadata states
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDescription, setVideoDescription] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Additional metadata
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("public");
  const [category, setCategory] = useState<string>("travel");
  
  // Tag states
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState<boolean>(false);

  // Thumbnail generation
  const [customThumbnail, setCustomThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Privacy options
  const privacyOptions: PrivacyOption[] = [
    {
      value: "public",
      label: "Công khai",
      icon: () => <Icon icon="fluent:globe-24-filled" className="w-4 h-4" />,
      description: "Mọi người đều có thể xem video này"
    },
    {
      value: "friend",
      label: "Bạn bè",
      icon: () => <Icon icon="fluent:people-24-filled" className="w-4 h-4" />,
      description: "Chỉ bạn bè của bạn mới có thể xem video này"
    },
    {
      value: "private",
      label: "Chỉ mình tôi",
      icon: () => <Icon icon="fluent:lock-closed-24-filled" className="w-4 h-4" />,
      description: "Chỉ bạn mới có thể xem video này"
    }
  ];

  // Category options
  const categoryOptions = [
    { value: "travel", label: "Du lịch", icon: "fluent:airplane-24-filled" },
    { value: "food", label: "Ẩm thực", icon: "fluent:food-24-filled" },
    { value: "adventure", label: "Phiêu lưu", icon: "fluent:mountain-24-filled" },
    { value: "culture", label: "Văn hóa", icon: "fluent:building-24-filled" },
    { value: "nature", label: "Thiên nhiên", icon: "fluent:leaf-24-filled" },
    { value: "city", label: "Thành phố", icon: "fluent:city-24-filled" },
    { value: "beach", label: "Biển", icon: "fluent:weather-sunny-24-filled" },
    { value: "other", label: "Khác", icon: "fluent:more-horizontal-24-filled" }
  ];

  const handleClose = () => {
    // Reset all states
    setVideoTitle("");
    setVideoDescription("");
    setSelectedVideo(null);
    setThumbnail(null);
    setTags([]);
    setTagInput("");
    setShowTagInput(false);
    setSelectedLocation(null);
    setPrivacy("public");
    setCategory("travel");
    setCustomThumbnail(null);
    setThumbnailPreview(null);
    onClose();
  };

  // Generate thumbnail from video
  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);

      video.onloadedmetadata = () => {
        // Seek to 1 second or 10% of video duration
        video.currentTime = Math.min(1, video.duration * 0.1);
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve(thumbnailUrl);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };
    });
  };

  // Get video duration
  const getVideoDuration = (videoFile: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);

      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const handleVideoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Vui lòng chọn file video hợp lệ!');
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      toast.error('Video quá lớn! Vui lòng chọn video nhỏ hơn 500MB.');
      return;
    }

    try {
      // Get video duration
      const duration = await getVideoDuration(file);
      
      // Validate duration (max 30 minutes)
      if (duration > 1800) {
        toast.error('Video quá dài! Vui lòng chọn video ngắn hơn 30 phút.');
        return;
      }

      // Generate preview URL
      const preview = URL.createObjectURL(file);
      
      // Generate thumbnail
      const thumbnailUrl = await generateThumbnail(file);
      
      setSelectedVideo({
        file,
        preview,
        duration,
        size: file.size
      });
      
      setThumbnail(thumbnailUrl);
      setThumbnailPreview(thumbnailUrl);
      
      toast.success('Video đã được tải lên!');
    } catch (error) {
      console.error('Error processing video:', error);
      toast.error('Không thể xử lý video. Vui lòng thử lại!');
    }
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Hình ảnh quá lớn! Vui lòng chọn hình ảnh nhỏ hơn 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setCustomThumbnail(file);
      setThumbnailPreview(preview);
    };
    reader.readAsDataURL(file);
  };

  const removeVideo = () => {
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo.preview);
    }
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail);
    }
    setSelectedVideo(null);
    setThumbnail(null);
    setThumbnailPreview(null);
    setCustomThumbnail(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Tag handling functions
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Format duration to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!videoTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề video!');
      return;
    }

    if (!selectedVideo) {
      toast.error('Vui lòng chọn video để tải lên!');
      return;
    }

    if (videoTitle.length < 10) {
      toast.error('Tiêu đề phải có ít nhất 10 ký tự!');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Video file
      formData.append('video', selectedVideo.file);
      
      // Metadata
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('privacy', privacy);
      formData.append('category', category);
      formData.append('duration', selectedVideo.duration.toString());
      
      // Thumbnail
      if (customThumbnail) {
        formData.append('thumbnail', customThumbnail);
      }
      
      // Location
      if (selectedLocation) {
        formData.append('location', selectedLocation);
      }
      
      // Tags
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

      // Call API to create video
      console.log('Tạo video mới:', {
        title: videoTitle,
        description: videoDescription,
        privacy,
        category,
        location: selectedLocation,
        tags,
        duration: selectedVideo.duration,
        size: selectedVideo.size
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Video đã được tải lên thành công!');
      handleClose();
      onSuccess?.();
      
      // Navigate to video page or my videos page
      // navigate('/watch/my-videos');

    } catch (error) {
      console.error('Lỗi khi tải video:', error);
      toast.error('Đã xảy ra lỗi khi tải video. Vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const currentPrivacy = privacyOptions.find(option => option.value === privacy);

  return (
    <div
      className="fixed inset-0 h-[100vh] flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50 px-4"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex flex-col items-start pr-8">
              <span className="flex items-center mb-1 text-base sm:text-lg font-bold text-blue-600">
                <Icon icon="fluent:video-24-filled" className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6 mr-2" />
                TravelNest Watch
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Tạo Video Mới</h2>
            </div>
            <button
              className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-4 sm:right-5 top-4 sm:top-5 hover:bg-gray-300 cursor-pointer"
              onClick={handleClose}
              aria-label="Đóng"
            >
              <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
            </button>
          </div>
          
          {/* Privacy Info */}
          <div className="px-4 sm:px-5 pb-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
              {currentPrivacy?.icon()}
              <span className="text-xs text-blue-700">
                <strong>{currentPrivacy?.label}:</strong> {currentPrivacy?.description}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* User Profile Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full flex-shrink-0">
              <img
                src={`${avatar !== null ? avatar : avatardf}`}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                {firstName} {lastName}
              </span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="h-8 flex items-center">
                  <PrivacyDropdown
                    value={privacy}
                    onChange={setPrivacy}
                    options={privacyOptions}
                  />
                </div>
                
                {/* Location Button */}
                <TravelButton
                  type="default"
                  onClick={() => setSelectedLocation(selectedLocation ? null : '')}
                  className={`!h-8 !py-0 !px-2.5 !min-w-0 ${
                    selectedLocation 
                      ? '!border-blue-500 !bg-blue-50 !text-blue-600' 
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon icon="fluent:location-24-filled" className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Địa điểm</span>
                  </div>
                </TravelButton>

                {/* Tags Button */}
                <TravelButton
                  type="default"
                  onClick={() => setShowTagInput(!showTagInput)}
                  className={`!h-8 !py-0 !px-2.5 !min-w-0 ${
                    showTagInput || tags.length > 0
                      ? '!border-purple-500 !bg-purple-50 !text-purple-600' 
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon icon="fluent:number-symbol-24-filled" className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Thẻ {tags.length > 0 && `(${tags.length})`}</span>
                  </div>
                </TravelButton>
              </div>
            </div>
          </div>
          {/* Location Section - Collapsible */}
          {selectedLocation !== null && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Icon icon="fluent:location-24-filled" className="w-4 h-4 text-blue-600" />
                  Địa điểm
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation(null);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Xóa
                </button>
              </div>
              <LocationDropdown
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Chọn địa điểm..."
                type={true}
              />
            </div>
          )}

          {/* Tags Section - Collapsible */}
          {showTagInput && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Icon icon="fluent:number-symbol-24-filled" className="w-4 h-4 text-purple-600" />
                  Thẻ <span className="text-xs text-gray-500">(Tối đa 5)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowTagInput(false);
                    setTagInput("");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              {/* Display existing tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full"
                    >
                      <Icon icon="fluent:number-symbol-24-filled" className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-purple-500 hover:text-purple-700 cursor-pointer"
                        aria-label={`Xóa thẻ ${tag}`}
                      >
                        <Icon icon="fluent:dismiss-12-filled" className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Icon icon="fluent:hash-24-filled" className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Nhập thẻ và nhấn Enter..."
                    className="w-full py-2 pr-4 border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="p-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon icon="fluent:add-24-filled" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column - Video Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Video</h3>
              
              {!selectedVideo ? (
                <div className="flex flex-col items-center">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                    <div className="flex flex-col items-center py-8">
                      <Icon icon="fluent:video-add-24-filled" className="w-16 h-16 mb-4 text-gray-400" />
                      <span className="mb-2 text-sm font-medium text-gray-600">Tải lên Video</span>
                      <span className="text-xs text-center text-gray-500 px-4">
                        Nhấp để duyệt hoặc kéo thả video<br />
                        MP4, MOV, AVI • Tối đa 500MB • Tối đa 30 phút
                      </span>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoSelect}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Video Preview */}
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                    <video
                      src={selectedVideo.preview}
                      className="w-full h-64 object-cover"
                      controls
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute flex items-center justify-center w-8 h-8 text-white bg-red-600 rounded-full top-2 right-2 hover:bg-red-700 cursor-pointer"
                    >
                      <Icon icon="fluent:delete-24-filled" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Info */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tên file:</span>
                      <span className="font-medium text-gray-900 truncate ml-2 max-w-[200px]">
                        {selectedVideo.file.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span className="font-medium text-gray-900">
                        {formatDuration(selectedVideo.duration)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Kích thước:</span>
                      <span className="font-medium text-gray-900">
                        {formatFileSize(selectedVideo.size)}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ảnh bìa <span className="text-xs text-gray-500">(Tùy chọn)</span>
                    </label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Generated Thumbnail */}
                      <div
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${
                          !customThumbnail ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setCustomThumbnail(null);
                          setThumbnailPreview(thumbnail);
                        }}
                      >
                        <img
                          src={thumbnail || ''}
                          alt="Generated thumbnail"
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          {!customThumbnail && (
                            <Icon icon="fluent:checkmark-circle-24-filled" className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <span className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-60 px-1 rounded">
                          Tự động
                        </span>
                      </div>

                      {/* Custom Thumbnail Upload */}
                      <label className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400">
                        {customThumbnail && thumbnailPreview ? (
                          <>
                            <img
                              src={thumbnailPreview}
                              alt="Custom thumbnail"
                              className="w-full h-20 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Icon icon="fluent:checkmark-circle-24-filled" className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-60 px-1 rounded">
                              Tùy chỉnh
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-20">
                            <Icon icon="fluent:image-add-24-regular" className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Tải ảnh</span>
                          </div>
                        )}
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailSelect}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Video Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Chi tiết</h3>

              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Nhập tiêu đề video..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Tối thiểu 10 ký tự</span>
                  <span className="text-xs text-gray-500">{videoTitle.length}/100</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mô tả <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Mô tả video của bạn..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">{videoDescription.length}/500</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        category === cat.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Icon icon={cat.icon} className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isUploading || !videoTitle.trim() || !selectedVideo || videoTitle.length < 10}
              className={`w-full py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                videoTitle.trim() && selectedVideo && videoTitle.length >= 10 && !isUploading
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Đang tải video lên...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Icon icon="fluent:video-add-24-filled" className="w-5 h-5" />
                  Tạo Video
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoCreateModal;
