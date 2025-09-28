import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import LocationDropdown from "../../common/inputs/LocationDropdown";
import avatardf from '../../../assets/images/avatar_default.png'
import { MdOutlineExplore } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

    for (let file of files) {
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

      for (let file of files) {
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
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('privacy', privacy);

      // Add all media files
      selectedMedia.forEach((media) => {
        formData.append(`media`, media.file);
      });

      formData.append('mediaCount', selectedMedia.length.toString());

      if (selectedLocation) {
        formData.append('location', selectedLocation);
      }
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

       // Call API to create post
       let response;
       if (groupId) {
         formData.append('groupId', groupId);
         console.log('Tạo bài viết cho nhóm:', groupId, formData);
         response = { status: "SUCCESS" }; // Mock response
       } else {
         console.log('Tạo bài viết cho người dùng:', formData);
         response = { status: "SUCCESS" }; // Mock response
       }

       if (response?.status === "SUCCESS") {
         // Reset form and close modal
         if (location === "home") {
           navigate(`/user/${userId}`);
         } else {
           handleClose();
           setCreateSuccess && setCreateSuccess(true);
           toast.success('Tạo bài viết thành công!');
         }
       } else {
         throw new Error('Không thể tạo bài viết');
       }

     } catch (error) {
       console.error('Lỗi khi tạo bài viết:', error);
       toast.error('Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại!');
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
        className="flex items-center gap-3 p-4 mb-6 transition-colors bg-white shadow cursor-pointer rounded-xl hover:bg-gray-50 w-full"
        onClick={handleOpen}
      >
        <img
          src={`${avatar !== null ? avatar : avatardf}`}
          alt="avatar"
          className="object-cover w-10 h-10 rounded-full"
        />
         <input
           className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none pointer-events-none"
           placeholder="Chia sẻ câu chuyện du lịch của bạn..."
           readOnly
         />
         <button
           className="flex items-center gap-1 px-3 py-1 font-medium text-blue-600 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer"
           onClick={(e) => {
             e.stopPropagation();
             handleOpen();
           }}
         >
           <Icon icon="fluent:image-24-filled" className="w-5 h-5" />
           Hình ảnh
         </button>
         <button
           className="flex items-center gap-1 px-3 py-1 font-medium text-blue-600 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer"
           onClick={(e) => {
             e.stopPropagation();
             handleOpen();
           }}
         >
           <Icon icon="fluent:location-24-filled" className="w-5 h-5" />
           Địa điểm
         </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50"
          style={{ zIndex: 1000 }}
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-2xl mx-6 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col items-start">
                <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
                  <MdOutlineExplore className="text-blue-600 w-7 h-7" />
                  TravelNest
                </span>
                 <h2 className="text-2xl font-bold text-gray-800">Tạo Bài Viết</h2>
                 <p className="text-sm text-gray-500">Chia sẻ câu chuyện du lịch của bạn với cộng đồng</p>
              </div>
               <button
                 className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
                 onClick={handleClose}
                 aria-label="Đóng"
               >
                <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="p-6 space-y-6">
              {/* User Profile Section */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden rounded-full">
                  <img
                    src={`${avatar !== null ? avatar : avatardf}`}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-base font-semibold text-gray-800">{firstName} {lastName}</span>
                  <div className="flex items-center gap-3 mt-1">
                     <LocationDropdown
                       value={selectedLocation}
                       onChange={setSelectedLocation}
                       placeholder="Thêm địa điểm..."
                       type={true}
                     />

                    {/* Privacy Dropdown */}
                    <div className="relative">
                      <select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                        className="flex items-center gap-2 px-3 py-1 pr-8 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {privacyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <Icon icon="fluent:globe-24-filled" className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Info */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
                <Icon icon="fluent:globe-24-filled" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  <strong>{currentPrivacy?.label}:</strong> {currentPrivacy?.description}
                </span>
              </div>

               {/* Content Input */}
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-700">Bạn đang nghĩ gì?</label>
                 <textarea
                   className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   value={postContent}
                   onChange={(e) => setPostContent(e.target.value)}
                   rows={4}
                   placeholder="Chia sẻ trải nghiệm du lịch, suy nghĩ hoặc kỷ niệm của bạn..."
                   maxLength={2000}
                 />
                 <p className="mt-1 text-xs text-gray-500">{postContent.length}/2000 ký tự</p>
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
                 <button
                   type="submit"
                   disabled={isUploading || (!postContent.trim() && selectedMedia.length === 0)}
                   className={`w-full py-3 text-base font-semibold rounded-lg transition-all duration-200 ${(postContent.trim() || selectedMedia.length > 0) && !isUploading
                     ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg cursor-pointer"
                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
                     }`}
                 >
                   {isUploading ? (
                     <div className="flex items-center justify-center gap-2">
                       <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                       Đang tạo bài viết...
                     </div>
                   ) : (
                     'Tạo Bài Viết'
                   )}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreateModal;


