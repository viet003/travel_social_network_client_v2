import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { message, Tooltip } from "antd";
import { EditProfileModal, ImageUploadModal } from "../../../components/modal";
import UserSettingsDropdown from "../../../components/common/dropdowns/user/UserSettingsDropdown";
import { path } from "../../../utilities/path";
import avatardf from "../../../assets/images/avatar_default.png";
import {
  apiGetUserProfile,
  apiUpdateUserProfile,
  apiUpdateUserAvatar,
  apiUpdateUserCoverImage,
} from "../../../services/userService";
import {
  apiSendFriendRequest,
  apiUnfriend,
  apiBlockUser,
  apiUnblockUser,
} from "../../../services/friendshipService";
import { updateAvatarImg, updateCoverImg } from "../../../stores/actions/authAction";
import { createOrGetPrivateConversation } from "../../../stores/actions/conversationAction";
import type { UpdateUserDto } from "../../../types/user.types";

// Auth State Interface
interface AuthState {
  userId: string | null;
}

// Types
interface UserProfile {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  avatarImg?: string;
  coverImg?: string;
  followersCount?: number;
  followingCount?: number;
  gender?: string;
  dateOfBirth?: string;
  friendshipStatus?: "PENDING" | "ACCEPTED" | "BLOCKED" | null;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserProfile | null>(null);
  const createSuccess = false;

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState<boolean>(false);
  const [isCoverUploadOpen, setIsCoverUploadOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Get current logged-in user ID from Redux (for comparison only)
  const currentUserId = useSelector(
    (state: { auth: AuthState }) => state.auth.userId
  );

  // Get active tab from current path
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes(`/${path.USER_PHOTOS}`)) return "photos";
    if (pathname.includes(`/${path.USER_VIDEOS}`)) return "videos";
    if (pathname.includes(`/${path.USER_REVIEWS}`)) return "reviews";
    if (pathname.includes(`/${path.USER_FRIENDS}`)) return "friends";
    return "posts";
  };

  const activeTab = getActiveTab();

  // Fetch user profile data
  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await apiGetUserProfile(userId);
      if (response.data) {
        const userData = response.data;

        // Parse fullName into firstName and lastName
        const fullName = userData.userProfile?.fullName || "";
        const nameParts = fullName.trim().split(" ");
        const lastName = nameParts.pop() || ""; // Last word is lastName
        const firstName = nameParts.join(" ") || ""; // Rest is firstName

        const mappedUser: UserProfile = {
          userId: userData.userId || "",
          userName: userData.userName || "",
          firstName: firstName,
          lastName: lastName,
          bio: userData.userProfile?.about || undefined,
          location: userData.userProfile?.location || undefined,
          avatarImg: userData.avatarImg || undefined,
          coverImg: userData.coverImg || undefined,
          gender: userData.userProfile?.gender || undefined, // MALE, FEMALE, OTHER
          dateOfBirth: userData.userProfile?.dateOfBirth || undefined, // ISO date string
          friendshipStatus: userData.friendshipStatus || null,
          followersCount: userData.friendsCount || 0,
          followingCount: userData.postsCount || 0,
        };
        setUser(mappedUser);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      message.error("Không thể tải thông tin người dùng");
    }
  }, [userId]);

  // Load user profile when userId changes
  useEffect(() => {
    fetchUserData();
  }, [userId, fetchUserData]);

  // Handle send friend request
  const handleSendFriendRequest = async () => {
    if (!userId) return;

    try {
      await apiSendFriendRequest(userId);
      message.success("Đã gửi lời mời kết bạn");
      // Refresh user data to update friendship status
      fetchUserData();
    } catch (error) {
      console.error("Error sending friend request:", error);
      message.error("Không thể gửi lời mời kết bạn");
    }
  };

  // Handle unfriend
  const handleUnfriend = async () => {
    if (!userId) return;

    try {
      await apiUnfriend(userId);
      message.success("Đã hủy kết bạn");
      // Refresh user data to update friendship status
      fetchUserData();
    } catch (error) {
      console.error("Error unfriending:", error);
      message.error("Không thể hủy kết bạn");
    }
  };

  // Handle report user
  const handleReportUser = () => {
    setIsDropdownOpen(false);
    // TODO: Implement report modal/functionality
    message.info("Chức năng báo cáo đang được phát triển");
  };

  // Handle block user
  const handleBlockUser = async () => {
    if (!userId) return;
    
    setIsDropdownOpen(false);
    
    try {
      const response = await apiBlockUser(userId);
      
      if (response.data) {
        message.success("Đã chặn người dùng");
        
        // Update user state with new friendship status
        if (user) {
          setUser({
            ...user,
            friendshipStatus: response.data.friendshipStatus,
          });
        }
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("Không thể chặn người dùng");
    }
  };

  // Handle unblock user
  const handleUnblockUser = async () => {
    if (!userId) return;
    
    setIsDropdownOpen(false);
    
    try {
      const response = await apiUnblockUser(userId);
      
      if (response.data) {
        message.success("Đã bỏ chặn người dùng");
        
        // Update user state with new friendship status
        if (user) {
          setUser({
            ...user,
            friendshipStatus: response.data.friendshipStatus,
          });
        }
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      message.error("Không thể bỏ chặn người dùng");
    }
  };

  // Handle message button click
  const handleMessageClick = async () => {
    if (!userId) return;
    
    console.log('🔵 Starting conversation with userId:', userId);
    
    try {
      // Create or get private conversation with this user
      const result = await dispatch(createOrGetPrivateConversation(userId) as any);
      console.log('✅ Conversation created/retrieved:', result);
      message.success("Đang mở cuộc trò chuyện...");
      
      // TODO: Navigate to messages page or open chat modal
      // navigate('/home/messages');
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      message.error("Không thể tạo cuộc trò chuyện");
    }
  };

  // Render friend action button based on friendship status
  const renderFriendButton = () => {
    if (currentUserId === userId) return null;

    const friendshipStatus = user?.friendshipStatus;

    if (friendshipStatus === "ACCEPTED") {
      // Already friends - show unfriend button
      return (
        <button
          className="h-8 sm:h-11 px-3 sm:px-4 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer flex flex-row gap-1.5 sm:gap-2 items-center"
          onClick={handleUnfriend}
          title="Hủy kết bạn"
        >
          <Icon icon="lucide:user-check" width={16} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Bạn bè</span>
        </button>
      );
    } else if (friendshipStatus === "PENDING") {
      // Friend request pending
      return (
        <button
          className="h-8 sm:h-11 px-3 sm:px-4 text-white transition rounded-full bg-black/40 flex flex-row gap-1.5 sm:gap-2 items-center"
          disabled
          title="Đã gửi lời mời"
        >
          <Icon icon="lucide:clock" width={16} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Đã gửi</span>
        </button>
      );
    } else if (friendshipStatus === "BLOCKED") {
      // User is blocked
      return (
        <button
          className="h-8 sm:h-11 px-3 sm:px-4 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer flex flex-row gap-1.5 sm:gap-2 items-center"
          disabled
          title="Đã chặn"
        >
          <Icon icon="lucide:user-x" width={16} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Đã chặn</span>
        </button>
      );
    } else {
      // No relationship (null) or rejected - show add friend button
      return (
        <button
          className="h-8 sm:h-11 px-3 sm:px-4 text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer flex flex-row gap-1.5 sm:gap-2 items-center"
          onClick={handleSendFriendRequest}
          title="Kết bạn"
        >
          <Icon icon="lucide:user-plus" width={16} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Kết bạn</span>
        </button>
      );
    }
  };

  // Handle update posts count from child components
  const handlePostsLoaded = useCallback(
    (count: number) => {
      if (user) {
        setUser({
          ...user,
          followingCount: count,
        });
      }
    },
    [user]
  );

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    const basePath = `/home/user/${userId}`;
    switch (tabId) {
      case "posts":
        navigate(basePath);
        break;
      case "photos":
        navigate(`${basePath}/${path.USER_PHOTOS}`);
        break;
      case "videos":
        navigate(`${basePath}/${path.USER_VIDEOS}`);
        break;
      case "reviews":
        navigate(`${basePath}/${path.USER_REVIEWS}`);
        break;
      case "friends":
        navigate(`${basePath}/${path.USER_FRIENDS}`);
        break;
      default:
        navigate(basePath);
    }
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    if (userId) {
      navigate(`/home/user/${userId}`);
    }
  };

  // Handle edit profile
  const handleEditProfile = async (formData: {
    userName?: string;
    firstName: string;
    lastName: string;
    location?: string;
    about?: string;
    gender?: string;
    dateOfBirth?: string;
  }) => {
    try {
      setIsUploading(true);

      const updateData: UpdateUserDto = {
        userName: formData.userName || user?.userId || "",
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location || "",
        gender: formData.gender || "OTHER",
        dateOfBirth:
          formData.dateOfBirth || new Date().toISOString().split("T")[0],
        about: formData.about,
      };

      const response = await apiUpdateUserProfile(updateData);

      if (response.data) {
        message.success("Cập nhật thông tin thành công");

        // Parse fullName from response
        const fullName = response.data.userProfile?.fullName || "";
        const nameParts = fullName.trim().split(" ");
        const lastName = nameParts.pop() || "";
        const firstName = nameParts.join(" ") || "";

        // Update local user state
        if (user) {
          setUser({
            ...user,
            firstName: firstName,
            lastName: lastName,
            bio: response.data.userProfile?.about || undefined,
            location: response.data.userProfile?.location || undefined,
            gender: response.data.userProfile?.gender || undefined,
            dateOfBirth: response.data.userProfile?.dateOfBirth || undefined,
          });
        }
        setIsEditProfileOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thông tin thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploading(true);

      const response = await apiUpdateUserAvatar(file);

      if (response.data && response.data.mediaList && response.data.mediaList.length > 0) {
        const newAvatarUrl = response.data.mediaList[0].url;
        message.success("Cập nhật ảnh đại diện thành công");
        
        // Update local user state with new avatar from post media
        if (user) {
          setUser({
            ...user,
            avatarImg: newAvatarUrl,
          });
        }

        // Update Redux store if this is current user's profile
        if (userId === currentUserId) {
          dispatch(updateAvatarImg(newAvatarUrl));
        }

        setIsAvatarUploadOpen(false);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Cập nhật ảnh đại diện thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cover photo upload
  const handleCoverUpload = async (file: File) => {
    try {
      setIsUploading(true);

      const response = await apiUpdateUserCoverImage(file);

      if (response.data && response.data.mediaList && response.data.mediaList.length > 0) {
        const newCoverUrl = response.data.mediaList[0].url;
        message.success("Cập nhật ảnh bìa thành công");
        
        // Update local user state with new cover from post media
        if (user) {
          setUser({
            ...user,
            coverImg: newCoverUrl,
          });
        }

        // Update Redux store if this is current user's profile
        if (userId === currentUserId) {
          dispatch(updateCoverImg(newCoverUrl));
        }

        setIsCoverUploadOpen(false);
      }
    } catch (error) {
      console.error("Error uploading cover:", error);
      message.error("Cập nhật ảnh bìa thất bại");
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
            backgroundImage: `url('${
              user?.coverImg ||
              "/placeholder.svg?height=400&width=1200&text=Beach+Sunset"
            }')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Action buttons */}
        <div className="absolute flex gap-2 sm:gap-3 top-3 right-3 sm:top-6 sm:right-6">
          {currentUserId !== userId && user?.friendshipStatus !== "BLOCKED" && (
            <>
              {renderFriendButton()}
              <Tooltip title="Nhắn tin" placement="bottom">
                <button 
                  className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
                  onClick={handleMessageClick}
                >
                  <Icon
                    icon="lucide:message-circle"
                    width={16}
                    className="sm:w-5 sm:h-5"
                  />
                </button>
              </Tooltip>
            </>
          )}
          {userId === currentUserId && (
            <Tooltip title="Chỉnh sửa trang cá nhân" placement="bottom">
              <button
                className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <Icon icon="lucide:edit-3" width={16} className="sm:w-5 sm:h-5" />
              </button>
            </Tooltip>
          )}

          <Tooltip title="Chia sẻ trang cá nhân" placement="bottom">
            <button className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer">
              <Icon icon="lucide:share-2" width={16} className="sm:w-5 sm:h-5" />
            </button>
          </Tooltip>

          {userId !== currentUserId && (
            <div className="relative">
              <Tooltip title="Tùy chọn khác" placement="bottom">
                <button
                  className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center text-white transition rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Icon
                    icon="lucide:more-vertical"
                    width={16}
                    className="sm:w-5 sm:h-5"
                  />
                </button>
              </Tooltip>

              <UserSettingsDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onReport={handleReportUser}
                onBlock={handleBlockUser}
                onUnblock={handleUnblockUser}
                friendshipStatus={user?.friendshipStatus}
              />
            </div>
          )}
        </div>

        {/* Cover photo upload button */}
        {userId === currentUserId && (
          <div className="absolute z-30 flex items-center gap-2 top-3 left-3 sm:top-6 sm:left-6">
            <Tooltip title="Cập nhật ảnh bìa" placement="bottom">
              <button
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer"
                onClick={() => setIsCoverUploadOpen(true)}
              >
                <Icon icon="lucide:camera" width={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Thay đổi ảnh bìa</span>
                <span className="sm:hidden">Ảnh bìa</span>
              </button>
            </Tooltip>
          </div>
        )}

        {/* Profile info */}
        <div className="absolute max-w-full sm:max-w-2xl p-3 sm:p-6 lg:p-8 text-white bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl min-h-[140px] sm:min-h-[180px] lg:min-h-[200px]">
          <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 h-full">
            <div className="relative cursor-pointer group flex-shrink-0">
              <Tooltip title={userId === currentUserId ? "Cập nhật ảnh đại diện" : "Xem ảnh đại diện"} placement="bottom">
                <img
                  src={user?.avatarImg || avatardf}
                  alt="Profile"
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 transition-all duration-300 border-2 sm:border-4 rounded-full shadow-lg border-white/30 hover:shadow-xl group-hover:scale-105"
                  onClick={handleProfileClick}
                />
              </Tooltip>

              {userId === currentUserId && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 rounded-full opacity-0 cursor-pointer pointer-events-auto bg-black/40 group-hover:opacity-100"
                  onClick={() => setIsAvatarUploadOpen(true)}
                >
                  <div className="p-2 sm:p-3 transition-transform duration-200 transform scale-75 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-100">
                    <Icon
                      icon="lucide:camera"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="absolute flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full shadow-md -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1">
                <Icon
                  icon="lucide:check-circle"
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500"
                />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 border-2 rounded-full opacity-0 border-white/50 group-hover:opacity-100 animate-pulse"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="mb-1 sm:mb-2 text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                {user?.firstName} {user?.lastName}
              </h1>
              {user?.location && (
                <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3 text-white/80">
                  <Icon
                    icon="lucide:map-pin"
                    width={12}
                    className="sm:w-4 sm:h-4 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm lg:text-base truncate">
                    {user.location}
                  </span>
                </div>
              )}
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 line-clamp-2 sm:line-clamp-3 w-full sm:w-[80%] lg:w-[60%]">
                {user?.bio ||
                  "Người yêu thích du lịch | Nhiếp ảnh gia | 35 quốc gia"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats - Bottom Right */}
        <div className="absolute p-2 sm:p-3 lg:p-4 text-white bottom-3 right-3 sm:bottom-6 sm:right-6 bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl">
          <div className="flex gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-white">
                {user?.followingCount || 0}
              </div>
              <div className="text-[10px] sm:text-xs text-white/80">
                Bài viết
              </div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-xl lg:text-2xl font-bold text-white">
                {user?.followersCount || 0}
              </div>
              <div className="text-[10px] sm:text-xs text-white/80">Bạn bè</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white overflow-x-auto">
        <div className="max-w-[1200px] mx-auto p-3 sm:px-6 lg:px-[50px]">
          <div className="flex space-x-1">
            {[
              { id: "posts", label: "Bài viết", icon: "lucide:camera", tooltip: "Xem bài viết" },
              { id: "photos", label: "Ảnh", icon: "lucide:image", tooltip: "Xem ảnh" },
              { id: "videos", label: "Video", icon: "lucide:video", tooltip: "Xem video" },
              {
                id: "reviews",
                label: "Đánh giá",
                icon: "lucide:message-square",
                tooltip: "Xem đánh giá"
              },
              { id: "friends", label: "Bạn bè", icon: "lucide:users", tooltip: "Xem danh sách bạn bè" },
            ].map(({ id, label, icon, tooltip }) => (
              <Tooltip key={id} title={tooltip} placement="top">
                <button
                  onClick={() => handleTabClick(id)}
                  className={`flex cursor-pointer items-center space-x-2 px-3 sm:px-4 py-3 font-medium transition-colors flex-shrink-0 whitespace-nowrap ${
                    activeTab === id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon icon={icon} className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">{label}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-6 lg:px-[50px] py-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        {currentUserId !== userId && user?.friendshipStatus === "BLOCKED" ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32">
            <div className="text-center max-w-md px-4">
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex p-4 sm:p-5 rounded-full bg-red-50">
                  <Icon
                    icon="lucide:ban"
                    className="w-12 h-12 sm:w-16 sm:h-16 text-red-500"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Nội dung bị hạn chế
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Bạn đã bị chặn bởi người dùng này và không thể xem bất kỳ nội dung nào của họ.
              </p>
            </div>
          </div>
        ) : currentUserId !== userId && user?.friendshipStatus !== "ACCEPTED" ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32">
            <div className="text-center max-w-md px-4">
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex p-4 sm:p-5 rounded-full bg-blue-50">
                  <Icon
                    icon="lucide:lock"
                    className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Nội dung riêng tư
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                Người dùng này đã đặt chế độ riêng tư cho tài khoản. Hãy kết bạn để xem bài viết, ảnh và nội dung khác của họ.
              </p>
              {user?.friendshipStatus === "PENDING" ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-gray-600 bg-gray-100 rounded-lg">
                  <Icon icon="lucide:clock" className="w-5 h-5" />
                  Đã gửi lời mời kết bạn
                </div>
              ) : (
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={handleSendFriendRequest}
                >
                  <Icon icon="lucide:user-plus" className="w-5 h-5" />
                  Gửi lời mời kết bạn
                </button>
              )}
            </div>
          </div>
        ) : (
          <Outlet
            context={{
              createSuccess,
              onPostsLoaded: handlePostsLoaded,
              onOpenEditProfile: () => setIsEditProfileOpen(true),
            }}
          />
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleEditProfile}
        initialValues={{
          userName: user?.userId || "",
          userProfile: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            location: user?.location || "",
            gender: user?.gender || "OTHER",
            dateOfBirth: user?.dateOfBirth || "",
            about: user?.bio || "",
          },
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
