import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import LocationDropdown from "../../common/inputs/LocationDropdown";
import TiptapEditor from '../../ui/TiptapEditor';
import { PrivacyDropdown } from '../../common/dropdowns';
import avatardf from '../../../assets/images/avatar_default.png'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../../styles/tiptap-editor.css';
import { apiCreatePost, apiCreatePostInGroup } from '../../../services/postService';
import type { UpdatePostDto } from '../../../types/post.types';
import TravelButton from '../../ui/customize/TravelButton';

// Types
interface MediaItem {
  file: File;
  type: string;
  preview: string | null;
  id: number;
}

interface PrivacyOption {
  value: string;
  label: string;
  icon: () => React.ReactElement;
  description: string;
}

interface PostCreateModalProps {
  setCreateSuccess?: (success: boolean) => void;
  location?: string;
  groupId?: string | null;
}

interface AuthState {
  userId: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
}

const PostCreateModal: React.FC<PostCreateModalProps> = ({
  setCreateSuccess,
  location,
  groupId = null
}) => {
  const { userId, avatar, firstName, lastName } = useSelector((state: { auth: AuthState }) => state.auth);

  const [postContent, setPostContent] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("public");

  const navigate = useNavigate();

  // Tag states
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState<boolean>(false);

   // Privacy options
   const privacyOptions: PrivacyOption[] = [
     {
       value: "public",
       label: "Công khai",
       icon: () => <Icon icon="fluent:globe-24-filled" className="w-4 h-4" />,
       description: "Mọi người đều có thể xem bài viết này"
     },
     {
       value: "friend",
       label: "Bạn bè",
       icon: () => <Icon icon="fluent:people-24-filled" className="w-4 h-4" />,
       description: "Chỉ bạn bè của bạn mới có thể xem bài viết này"
     },
     {
       value: "private",
       label: "Chỉ mình tôi",
       icon: () => <Icon icon="fluent:lock-closed-24-filled" className="w-4 h-4" />,
       description: "Chỉ bạn mới có thể xem bài viết này"
     }
   ];

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedMedia([]);
    setPostContent("");
    setTags([]);
    setTagInput("");
    setShowTagInput(false);
    setSelectedLocation(null);
    setPrivacy("public");
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
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 3) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    for (const file of files) {
       // Check file size (20MB = 20 * 1024 * 1024 bytes)
       if (file.size > 20 * 1024 * 1024) {
         toast.error('Tệp quá lớn! Vui lòng chọn tệp nhỏ hơn 20MB.');
         return;
       }

       // Check file type
       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
       if (!allowedTypes.includes(file.type)) {
         toast.error('Chỉ hỗ trợ tệp hình ảnh (JPEG, PNG, GIF) và tệp video (MP4, MOV, AVI)!');
         return;
       }

      const isVideo = file.type.startsWith('video/');
      const currentVideos = selectedMedia.filter(media => media.type.startsWith('video/'));

       // Check video restrictions
       if (isVideo && currentVideos.length > 0) {
         toast.error('Bạn chỉ có thể thêm một video cho mỗi bài viết!');
         return;
       }

       // Check if adding video when images exist
       if (isVideo && selectedMedia.some(media => media.type.startsWith('image/'))) {
         toast.error('Bạn không thể trộn video với hình ảnh. Vui lòng xóa tất cả hình ảnh trước hoặc chỉ chọn hình ảnh.');
         return;
       }

       // Check if adding image when video exists
       if (!isVideo && selectedMedia.some(media => media.type.startsWith('video/'))) {
         toast.error('Bạn không thể trộn hình ảnh với video. Vui lòng xóa video trước hoặc chỉ chọn video.');
         return;
       }

       // Check maximum images (e.g., 10 images max)
       if (!isVideo && selectedMedia.length >= 10) {
         toast.error('Bạn chỉ có thể thêm tối đa 10 hình ảnh cho mỗi bài viết!');
         return;
       }
    }

    // Process files
    const processFiles = async (files: File[]) => {
      const newMedia: MediaItem[] = [];

      for (const file of files) {
        const mediaItem: MediaItem = {
          file: file,
          type: file.type,
          preview: null,
          id: Date.now() + Math.random() // Generate unique ID
        };

        // Create preview
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            mediaItem.preview = e.target?.result as string;
            resolve();
          };
          reader.readAsDataURL(file);
        });

        newMedia.push(mediaItem);
      }

      setSelectedMedia(prev => [...prev, ...newMedia]);
    };

    processFiles(files);
  };

  const removeMedia = (mediaId: number) => {
    setSelectedMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const removeAllMedia = () => {
    setSelectedMedia([]);
  };

   const handlePost = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!postContent.trim() && selectedMedia.length === 0) {
       toast.error('Vui lòng nhập nội dung hoặc chọn phương tiện!');
       return;
     }

    setIsUploading(true);

    try {
      // Map privacy values to match API expectations
      const privacyMap: { [key: string]: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE' } = {
        'public': 'PUBLIC',
        'friend': 'FRIENDS_ONLY',
        'private': 'PRIVATE'
      };

      // Prepare post data
      const postData: UpdatePostDto = {
        content: postContent,
        privacy: privacyMap[privacy] || 'PUBLIC',
        location: selectedLocation || undefined,
        tags: tags.length > 0 ? tags : undefined,
        mediaFiles: selectedMedia.length > 0 ? selectedMedia.map(media => media.file) : undefined
      };

      // Debug log
      console.log('📤 Sending post data:', {
        content: postContent,
        privacy: postData.privacy,
        location: postData.location,
        tags: postData.tags,
        mediaCount: postData.mediaFiles?.length || 0,
        mediaFiles: postData.mediaFiles?.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

       // Call API to create post
       let response;
       if (groupId) {
         // Create post in group
         response = await apiCreatePostInGroup(groupId, postData);
       } else {
         // Create post on user profile
         response = await apiCreatePost(postData);
       }

      console.log('✅ Post created successfully:', response);

       if (response?.success) {
         toast.success('Tạo bài viết thành công!');
         
         // Reset form and close modal
         handleClose();
         
         // Trigger success callback if provided
         if (setCreateSuccess) {
           setCreateSuccess(true);
         }
         
         // Navigate if needed
         if (location === "home") {
           navigate(`/user/${userId}`);
         }
       } else {
         throw new Error(response?.message || 'Không thể tạo bài viết');
       }

     } catch (error: unknown) {
       console.error('❌ Lỗi khi tạo bài viết:', error);
       const errorMessage = error && typeof error === 'object' && 'message' in error 
         ? (error as { message: string }).message 
         : 'Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại!';
       toast.error(errorMessage);
     } finally {
       setIsUploading(false);
     }
  };

  const hasVideo = selectedMedia.some(media => media.type.startsWith('video/'));
  const hasImages = selectedMedia.some(media => media.type.startsWith('image/'));

  // Get current privacy option details
  const currentPrivacy = privacyOptions.find(option => option.value === privacy);

  return (
    <>
      {/* Trigger Button */}
      <div
        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 mb-4 sm:mb-6 transition-colors bg-white shadow cursor-pointer rounded-xl hover:bg-gray-50 w-full"
        onClick={handleOpen}
      >
        <img
          src={`${avatar !== null ? avatar : avatardf}`}
          alt="avatar"
          className="object-cover w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
        />
         <input
           className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-100 rounded-full outline-none pointer-events-none min-w-0"
           placeholder="Chia sẻ câu chuyện..."
           readOnly
         />
         <button
           className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer flex-shrink-0"
           onClick={(e) => {
             e.stopPropagation();
             handleOpen();
           }}
         >
           <Icon icon="fluent:image-24-filled" className="w-4 h-4 sm:w-5 sm:h-5" />
           <span className="hidden md:inline">Hình ảnh</span>
         </button>
         <button
           className="hidden sm:flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer flex-shrink-0"
           onClick={(e) => {
             e.stopPropagation();
             handleOpen();
           }}
         >
           <Icon icon="fluent:location-24-filled" className="w-4 h-4 sm:w-5 sm:h-5" />
           <span className="hidden md:inline">Địa điểm</span>
         </button>
         {/* Mobile: Single action button */}
         <button
           className="flex sm:hidden items-center justify-center p-2 text-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 cursor-pointer flex-shrink-0"
           onClick={(e) => {
             e.stopPropagation();
             handleOpen();
           }}
         >
           <Icon icon="fluent:add-24-filled" className="w-5 h-5" />
         </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 h-[100vh] flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50 px-4"
          style={{ zIndex: 1000 }}
          onClick={handleClose}
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
                  <Icon icon="fluent:compass-northwest-24-regular" className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6" />
                  TravelNest
                </span>
                 <h2 className="text-lg sm:text-xl font-bold text-gray-800">Tạo Bài Viết</h2>
                 <p className="text-xs text-gray-500 hidden sm:block">Chia sẻ câu chuyện du lịch của bạn với cộng đồng</p>
              </div>
               <button
                 className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-4 sm:right-5 top-4 sm:top-5 hover:bg-gray-300 cursor-pointer"
                 onClick={handleClose}
                 aria-label="Đóng"
               >
                <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
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
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{firstName} {lastName}</span>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                     <LocationDropdown
                       value={selectedLocation}
                       onChange={setSelectedLocation}
                       placeholder="Thêm địa điểm..."
                       type={true}
                     />

                    {/* Privacy Selector */}
                    <PrivacyDropdown
                      value={privacy}
                      onChange={setPrivacy}
                      options={privacyOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Info */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
                <Icon icon="fluent:globe-24-filled" className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-blue-700">
                  <strong>{currentPrivacy?.label}:</strong> {currentPrivacy?.description}
                </span>
              </div>

               {/* Content Input with Tiptap Editor */}
               <div>
                 <label className="block mb-2 text-xs font-medium text-gray-700">Nội dung bài viết</label>
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
                  Thẻ <span className="text-xs text-gray-500">(Tùy chọn, tối đa 3)</span>
                </label>

                {/* Display existing tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
                      >
                        <Icon icon="fluent:number-symbol-24-filled" className="w-3 h-3" />
                        {tag}
                         <button
                           type="button"
                           onClick={() => removeTag(tag)}
                           className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                           aria-label={`Xóa thẻ ${tag}`}
                         >
                          <Icon icon="fluent:dismiss-12-filled" className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag input */}
                {showTagInput ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="relative flex-1">
                      <Icon icon="fluent:hash-24-filled" className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                       <input
                         type="text"
                         value={tagInput}
                         onChange={handleTagInputChange}
                         onKeyPress={handleTagInputKeyPress}
                         placeholder="Nhập thẻ và nhấn Enter..."
                         className="w-full py-2 pr-4 border border-gray-300 rounded-full pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         maxLength={20}
                         autoFocus
                       />
                    </div>
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim() || tags.length >= 3}
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
                     disabled={tags.length >= 3}
                     className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                   >
                     <Icon icon="fluent:number-symbol-24-filled" className="w-4 h-4" />
                     Thêm Thẻ ({tags.length}/3)
                   </button>
                )}
              </div>

              {/* Media Upload Section */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Phương tiện <span className="text-xs text-gray-500">(Tùy chọn)</span>
                </label>

                {selectedMedia.length > 0 ? (
                  <div className="space-y-3">
                    {/* Media counter and remove all button */}
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-600">
                         {selectedMedia.length} {hasVideo ? 'video' : 'hình ảnh'} đã chọn
                       </span>
                       <button
                         type="button"
                         onClick={removeAllMedia}
                         className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                       >
                         Xóa tất cả
                       </button>
                     </div>

                    {/* Video preview (single video) */}
                    {hasVideo && (
                      <div className="relative border border-gray-200 rounded-lg h-[250px] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => removeMedia(selectedMedia[0].id)}
                          className="absolute flex items-center justify-center w-8 h-8 text-white bg-gray-800 rounded-full z-9 top-2 right-2 bg-opacity-70 hover:bg-opacity-90"
                        >
                          <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4" />
                        </button>
                        <video
                          src={selectedMedia[0].preview || undefined}
                          className="object-cover w-full h-full"
                          controls
                        />
                      </div>
                    )}

                    {/* Images preview (multiple images) */}
                    {hasImages && (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedMedia.slice(0, 4).map((media, index) => (
                          <div
                            key={media.id}
                            className={`relative border border-gray-200 rounded-lg overflow-hidden ${selectedMedia.length === 1 ? 'col-span-2 h-[250px]' :
                              selectedMedia.length === 2 ? 'h-[200px]' :
                                selectedMedia.length === 3 && index === 0 ? 'col-span-2 h-[200px]' :
                                  'h-[150px]'
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="absolute z-10 flex items-center justify-center w-6 h-6 text-white bg-gray-800 rounded-full top-1 right-1 bg-opacity-70 hover:bg-opacity-90"
                            >
                              <Icon icon="fluent:dismiss-12-filled" className="w-3 h-3" />
                            </button>

                            <img
                              src={media.preview || undefined}
                              alt={`Preview ${index + 1}`}
                              className="object-cover w-full h-full"
                            />

                            {/* Show count overlay for more than 4 images */}
                            {index === 3 && selectedMedia.length > 4 && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <span className="text-2xl font-bold text-white">
                                  +{selectedMedia.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                     {/* Add more media button */}
                     <label className="flex items-center justify-center w-full py-3 text-sm font-medium text-blue-600 border border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-50">
                       <Icon icon="fluent:camera-24-filled" className="w-4 h-4 mr-2" />
                       Thêm {hasVideo ? 'không được phép' : 'hình ảnh'}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple={!hasVideo}
                        className="hidden"
                        onChange={handleMediaSelect}
                        disabled={hasVideo}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                       <div className="flex flex-col items-center py-8">
                         <Icon icon="fluent:image-24-filled" className="w-12 h-12 mb-4 text-gray-400" />
                         <span className="mb-2 text-sm font-medium text-gray-600">Tải lên Hình ảnh hoặc Video</span>
                         <span className="text-xs text-center text-gray-500">
                           Nhấp để duyệt hoặc kéo thả<br />
                           JPG, PNG, GIF, MP4, MOV, AVI • Tối đa 20MB mỗi tệp
                         </span>
                       </div>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={handleMediaSelect}
                      />
                    </label>
                  </div>
                )}
              </div>

               {/* Quick Actions */}
               <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                 <span className="block mb-3 text-sm font-medium text-gray-700">Thao tác nhanh</span>
                <div className="flex gap-2">
                  <label className="flex items-center justify-center w-10 h-10 text-green-500 rounded-full cursor-pointer hover:bg-gray-100">
                    <Icon icon="fluent:image-24-filled" className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple={!hasVideo}
                      className="hidden"
                      onChange={handleMediaSelect}
                    />
                  </label>
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
                     className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer ${showTagInput ? 'text-purple-600 bg-purple-100' : 'text-purple-500'}`}
                     aria-label="Thêm thẻ"
                   >
                     <Icon icon="fluent:number-symbol-24-filled" className="w-5 h-5" />
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
                     <Icon icon="fluent:more-horizontal-24-filled" className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <TravelButton
                    type="default"
                    htmlType="submit"
                    loading={isUploading}
                    disabled={isUploading || (!postContent.trim() && selectedMedia.length === 0)}
                    className="px-6"
                  >
                    Tạo Bài Viết
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

export default PostCreateModal;


