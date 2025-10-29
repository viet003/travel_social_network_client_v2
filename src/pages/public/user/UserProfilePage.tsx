import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { EditProfileModal, ImageUploadModal } from '../../../components/modal';
import { path } from '../../../utilities/path';
import avatardf from '../../../assets/images/avatar_default.png';

// Types
interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  avatarImg?: string;
  coverImg?: string;
  followersCount?: number;
  followingCount?: number;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  
  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState<boolean>(false);
  const [isCoverUploadOpen, setIsCoverUploadOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Mock current user ID - replace with actual auth state
  const currentUserId = "current-user-id";

  // Get active tab from current path
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes(`/${path.USER_PHOTOS}`)) return 'photos';
    if (pathname.includes(`/${path.USER_REVIEWS}`)) return 'reviews';
    if (pathname.includes(`/${path.USER_FRIENDS}`)) return 'friends';
    return 'posts';
  };

  const activeTab = getActiveTab();

  // Fetch user profile data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser: UserProfile = {
        userId: userId || "",
        firstName: "Nguyễn Văn",
        lastName: "An",
        bio: "Người yêu thích du lịch | Nhiếp ảnh gia | Đã khám phá 35 quốc gia",
        location: "Hà Nội, Việt Nam",
        avatarImg: "",
        coverImg: "",
        followersCount: 1234,
        followingCount: 567,
      };
      setUser(mockUser);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load user profile when userId changes
  useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId]);

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    const basePath = `/home/user/${userId}`;
    switch (tabId) {
      case 'posts':
        navigate(basePath);
        break;
      case 'photos':
        navigate(`${basePath}/${path.USER_PHOTOS}`);
        break;
      case 'reviews':
        navigate(`${basePath}/${path.USER_REVIEWS}`);
        break;
      case 'friends':
        navigate(`${basePath}/${path.USER_FRIENDS}`);
        break;
      default:
        navigate(basePath);
    }
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    if (userId) {
      navigate(`/user/${userId}`);
    }
  };

  // Handle edit profile
  const handleEditProfile = async (formData: any) => {
    try {
      setIsUploading(true);
      // TODO: Call API to update profile
      console.log('Updating profile:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.about,
          location: formData.location,
        });
      }
      
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File, type: string) => {
    try {
      setIsUploading(true);
      // TODO: Call API to upload avatar
      console.log('Uploading avatar:', file, type);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (user) {
        setUser({
          ...user,
          avatarImg: previewUrl,
        });
      }
      
      setIsAvatarUploadOpen(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cover photo upload
  const handleCoverUpload = async (file: File, type: string) => {
    try {
      setIsUploading(true);
      // TODO: Call API to upload cover photo
      console.log('Uploading cover:', file, type);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (user) {
        setUser({
          ...user,
          coverImg: previewUrl,
        });
      }
      
      setIsCoverUploadOpen(false);
    } catch (error) {
      console.error('Error uploading cover:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px] rounded-b-xl bg-gradient-to-br from-orange-400 via-pink-500 to-blue-600 max-w-[1200px] mx-auto">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url('${user?.coverImg || "/placeholder.svg?height=400&width=1200&text=Beach+Sunset"}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Action buttons */}
        <div className="absolute flex gap-2 sm:gap-3 top-3 right-3 sm:top-6 sm:right-6">
          {currentUserId !== userId && (
            <>
              <button className="p-2 sm:p-3 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer">
                <Icon icon="lucide:user-plus" width={16} className="sm:w-5 sm:h-5" />
              </button>
              <button className="p-2 sm:p-3 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer">
                <Icon icon="lucide:message-circle" width={16} className="sm:w-5 sm:h-5" />
              </button>
            </>
          )}
          {userId === currentUserId && (
            <button 
              className="p-2 sm:p-3 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer" 
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Icon icon="lucide:edit-3" width={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
          <button className="p-2 sm:p-3 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer">
            <Icon icon="lucide:share-2" width={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Cover photo upload button */}
        {userId === currentUserId && (
          <div className="absolute z-30 flex items-center gap-2 top-3 left-3 sm:top-6 sm:left-6">
            <button
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer"
              onClick={() => setIsCoverUploadOpen(true)}
            >
              <Icon icon="lucide:camera" width={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Thay đổi ảnh bìa</span>
              <span className="sm:hidden">Ảnh bìa</span>
            </button>
          </div>
        )}

        {/* Profile info */}
        <div className="absolute max-w-full sm:max-w-2xl p-3 sm:p-6 lg:p-8 text-white bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl min-h-[140px] sm:min-h-[180px] lg:min-h-[200px]">
          <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 h-full">
            <div className="relative cursor-pointer group flex-shrink-0">
              <img
                src={user?.avatarImg || avatardf}
                alt="Profile"
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 transition-all duration-300 border-2 sm:border-4 rounded-full shadow-lg border-white/30 hover:shadow-xl group-hover:scale-105"
                onClick={handleProfileClick}
              />

              {userId === currentUserId && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 rounded-full opacity-0 cursor-pointer pointer-events-auto bg-black/40 group-hover:opacity-100"
                  onClick={() => setIsAvatarUploadOpen(true)}
                >
                  <div className="p-2 sm:p-3 transition-transform duration-200 transform scale-75 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-100">
                    <Icon icon="lucide:camera" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              )}

              <div className="absolute flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full shadow-md -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1">
                <Icon icon="lucide:check-circle" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500" />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 border-2 rounded-full opacity-0 border-white/50 group-hover:opacity-100 animate-pulse"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="mb-1 sm:mb-2 text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                {user?.firstName} {user?.lastName}
              </h1>
              {user?.location && (
                <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3 text-white/80">
                  <Icon icon="lucide:map-pin" width={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base truncate">{user.location}</span>
                </div>
              )}
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 line-clamp-2 sm:line-clamp-3 w-full sm:w-[80%] lg:w-[60%]">
                {user?.bio || "Người yêu thích du lịch | Nhiếp ảnh gia | 35 quốc gia"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats - Bottom Right */}
        <div className="absolute p-2 sm:p-3 lg:p-4 text-white bottom-3 right-3 sm:bottom-6 sm:right-6 bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl">
          <div className="flex gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-white">{totalElements || 0}</div>
              <div className="text-[10px] sm:text-xs text-white/80">Bài viết</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-white">{user?.followersCount || 0}</div>
              <div className="text-[10px] sm:text-xs text-white/80">Bạn bè</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white overflow-x-auto">
        <div className="flex justify-center min-w-max px-3 sm:px-0">
          <div className="flex gap-2 sm:gap-4 lg:gap-8">
            {[
              { id: "posts", label: "Bài viết", icon: "lucide:camera" },
              { id: "photos", label: "Ảnh", icon: "lucide:image" },
              { id: "reviews", label: "Đánh giá", icon: "lucide:message-square" },
              { id: "friends", label: "Bạn bè", icon: "lucide:users" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`group relative flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 lg:px-4 transition-all duration-300 cursor-pointer flex-shrink-0 ${
                  activeTab === id
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-900 hover:text-gray-900 hover:bg-gray-50/50"
                }`}
              >
                <Icon icon={icon} width={16} className="sm:w-[18px] sm:h-[18px] transition-transform duration-200 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap">{label}</span>
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    activeTab === id
                      ? "bg-gradient-to-r from-blue-100/50 to-blue-200/50"
                      : "bg-gradient-to-r from-gray-100/50 to-gray-200/50"
                  }`}
                ></div>
                {activeTab === id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-6 lg:px-[50px] py-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        <Outlet context={{ 
          createSuccess, 
          onPostsLoaded: setTotalElements,
          onOpenEditProfile: () => setIsEditProfileOpen(true)
        }} />
      </div>

      {/* Modals */}
      <EditProfileModal
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleEditProfile}
        initialValues={{
          userName: `${user?.firstName || ''}${user?.lastName || ''}`.toLowerCase().replace(/\s+/g, ''),
          userProfile: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            location: user?.location || '',
            gender: 'other',
            dateOfBirth: '',
            about: user?.bio || '',
          }
        }}
      />

      <ImageUploadModal
        isOpen={isAvatarUploadOpen}
        onClose={() => setIsAvatarUploadOpen(false)}
        onSubmit={handleAvatarUpload}
        type="avatar"
        title="Tải ảnh đại diện lên"
        currentImage={user?.avatarImg}
        isUploading={isUploading}
      />

      <ImageUploadModal
        isOpen={isCoverUploadOpen}
        onClose={() => setIsCoverUploadOpen(false)}
        onSubmit={handleCoverUpload}
        type="cover"
        title="Tải ảnh bìa lên"
        currentImage={user?.coverImg}
        isUploading={isUploading}
      />
    </div>
  );
};

export default UserProfilePage;
