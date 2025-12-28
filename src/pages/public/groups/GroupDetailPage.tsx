import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Tooltip } from "antd";
import { path } from "../../../utilities/path";
import {
  apiGetGroupById,
  apiJoinGroup,
  apiLeaveGroup,
  apiUpdateGroup,
} from "../../../services/groupService";
import type { GroupResponse } from "../../../types/group.types";
import { toast } from "react-toastify";
import { ConfirmDeleteModal } from "../../../components/modal";
import { GroupEditModal } from "../../../components/modal/group";
import { TravelButton } from "../../../components/ui/customize";
import { LoadingSpinner } from "../../../components/ui/loading";

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupData, setGroupData] = useState<GroupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get active tab from current path
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes(`/${path.GROUP_ABOUT}`)) return "about";
    if (pathname.includes(`/${path.GROUP_MEMBERS}`)) return "members";
    if (pathname.includes(`/${path.GROUP_MEDIA}`)) return "media";
    return "discussion";
  };

  const activeTab = getActiveTab();

  // Fetch group details
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      setIsLoading(true);
      try {
        const response = await apiGetGroupById(groupId);
        setGroupData(response.data);
      } catch (error) {
        console.error("Error fetching group:", error);
        toast.error("Không thể tải thông tin nhóm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Redirect to about tab if user is not a member OR if group is locked (skip for admin)
  useEffect(() => {
    if (
      groupData &&
      groupData.currentUserRole !== "ADMIN" &&
      activeTab !== "about"
    ) {
      if (!groupData.isMember || groupData.isLocked) {
        navigate(`/home/groups/${groupId}/${path.GROUP_ABOUT}`, {
          replace: true,
        });
      }
    }
  }, [groupData, activeTab, groupId, navigate]);

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    if (!groupId) return;

    // Block navigation for locked groups (except admin)
    if (
      groupData?.isLocked &&
      groupData?.currentUserRole !== "ADMIN" &&
      tabId !== "about"
    ) {
      return;
    }

    const basePath = `/home/groups/${groupId}`;

    switch (tabId) {
      case "about":
        navigate(`${basePath}/${path.GROUP_ABOUT}`);
        break;
      case "discussion":
        navigate(basePath);
        break;
      case "members":
        navigate(`${basePath}/${path.GROUP_MEMBERS}`);
        break;
      case "media":
        navigate(`${basePath}/${path.GROUP_MEDIA}`);
        break;
    }
  };

  // Handle join/leave group
  const handleJoinLeave = async () => {
    if (!groupId || !groupData) return;

    setIsJoining(true);
    try {
      if (groupData.isMember) {
        await apiLeaveGroup(groupId);
        // Navigate back to groups page after leaving
        navigate("/home/groups", { replace: true });
      } else {
        const response = await apiJoinGroup(groupId);

        if (response.data.isMember) {
          // Public group - joined immediately
          setGroupData({
            ...groupData,
            isMember: true,
            memberCount: groupData.memberCount + 1,
          });
          // Redirect to discussion tab without reloading
          navigate(`/home/groups/${groupId}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error join/leave group:", error);
      toast.error(
        groupData.isMember
          ? "Không thể rời khỏi nhóm"
          : "Không thể tham gia nhóm"
      );
    } finally {
      setIsJoining(false);
      setShowMemberDropdown(false);
    }
  };

  // Handle delete group (OWNER only)
  const handleDeleteGroup = async () => {
    if (!groupId || !groupData) return;

    try {
      // TODO: Call API delete group when available
      toast.info("Chức năng xóa nhóm đang được phát triển");
      setShowMemberDropdown(false);
      // After successful deletion, navigate back to groups page
      // navigate('/home/groups');
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Không thể xóa nhóm");
      throw error;
    }
  };

  const handleOpenDeleteModal = () => {
    setShowMemberDropdown(false);
    setShowDeleteModal(true);
  };

  // Handle update group
  const handleUpdateGroup = async (data: {
    name: string;
    description: string;
    privacy: boolean;
    coverImage?: File;
  }) => {
    if (!groupId) return;

    try {
      const response = await apiUpdateGroup(groupId, data);
      setGroupData(response.data);
      toast.success("Cập nhật nhóm thành công!");
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Không thể cập nhật nhóm");
      throw error;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".member-dropdown-container")) {
        setShowMemberDropdown(false);
      }
    };

    if (showMemberDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMemberDropdown]);

  // Show only "about" tab if user is not a member
  const tabs = groupData?.isMember
    ? [
        { id: "about", label: "Giới thiệu", icon: "fluent:info-24-filled" },
        { id: "discussion", label: "Thảo luận", icon: "fluent:chat-24-filled" },
        { id: "members", label: "Mọi người", icon: "fluent:people-24-filled" },
        {
          id: "media",
          label: "File phương tiện",
          icon: "fluent:image-24-filled",
        },
      ]
    : [{ id: "about", label: "Giới thiệu", icon: "fluent:info-24-filled" }];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Icon
          icon="fluent:spinner-ios-20-filled"
          className="w-8 h-8 text-blue-600 animate-spin"
        />
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Không tìm thấy nhóm</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div>
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-b-xl bg-gray-200 max-w-[1200px] mx-auto overflow-hidden">
          <img
            src={
              groupData.coverImageUrl ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
            }
            alt={groupData.groupName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

          {/* Edit button for OWNER/ADMIN */}
          {groupData.currentUserRole === "OWNER" && (
            <div className="absolute z-30 flex items-center gap-2 top-3 left-3 sm:top-6 sm:left-6">
              <Tooltip title="Chỉnh sửa nhóm" placement="bottom">
                <button
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white transition rounded-lg bg-black/40 hover:bg-black/60 cursor-pointer"
                  onClick={() => setShowEditModal(true)}
                >
                  <Icon
                    icon="lucide:edit-3"
                    width={14}
                    className="sm:w-4 sm:h-4"
                  />
                  <span className="hidden sm:inline">Chỉnh sửa nhóm</span>
                  <span className="sm:hidden">Chỉnh sửa</span>
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="bg-white">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-[50px]">
            <div className="flex items-end justify-between py-4">
              <div className="flex items-end space-x-4">
                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {groupData.groupName}
                  </h1>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                    <Icon
                      icon={
                        !groupData.privacy
                          ? "fluent:globe-24-filled"
                          : "fluent:lock-closed-24-filled"
                      }
                      className="h-4 w-4"
                    />
                    <span>
                      {!groupData.privacy ? "Nhóm công khai" : "Nhóm riêng tư"}
                    </span>
                    <span>•</span>
                    <span>
                      {groupData.memberCount.toLocaleString()} thành viên
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 pb-2 flex-wrap sm:flex-nowrap">
                {groupData.friendMembers &&
                  groupData.friendMembers.length > 0 && (
                    <div className="flex -space-x-2 mr-2">
                      {groupData.friendMembers
                        .slice(0, 5)
                        .map((member, index) => (
                          <img
                            key={member.userId}
                            src={member.avatar || "https://i.pravatar.cc/40"}
                            alt={member.name}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                            style={{ zIndex: 5 - index }}
                            onClick={() =>
                              navigate(`/home/user/${member.userId}`)
                            }
                            title={member.name}
                          />
                        ))}
                    </div>
                  )}
                {groupData.isMember ? (
                  <>
                    <div className="relative member-dropdown-container">
                      <button
                        onClick={() =>
                          setShowMemberDropdown(!showMemberDropdown)
                        }
                        className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm cursor-pointer"
                      >
                        <Icon
                          icon="fluent:checkmark-24-filled"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                        <span className="hidden sm:inline">Đã tham gia</span>
                        <span className="sm:hidden">Joined</span>
                        <Icon
                          icon="fluent:chevron-down-24-filled"
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {showMemberDropdown && (
                        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            {groupData.currentUserRole === "OWNER" ? (
                              <button
                                onClick={handleOpenDeleteModal}
                                className="cursor-pointer w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                              >
                                <Icon
                                  icon="fluent:delete-24-regular"
                                  className="h-5 w-5"
                                />
                                <div>
                                  <div className="font-medium">Xóa nhóm</div>
                                  <div className="text-xs text-gray-500">
                                    Xóa vĩnh viễn nhóm này
                                  </div>
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={handleJoinLeave}
                                disabled={isJoining}
                                className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3 disabled:opacity-50"
                              >
                                <Icon
                                  icon="fluent:door-arrow-left-24-regular"
                                  className="h-5 w-5"
                                />
                                <div>
                                  <div className="font-medium">Rời nhóm</div>
                                  <div className="text-xs text-gray-500">
                                    Bạn sẽ không còn là thành viên
                                  </div>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm cursor-pointer">
                      <Icon
                        icon="fluent:share-24-filled"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <span className="hidden sm:inline">Chia sẻ</span>
                    </button>
                  </>
                ) : (
                  <TravelButton
                    type="primary"
                    onClick={handleJoinLeave}
                    disabled={isJoining}
                    loading={isJoining}
                    className="text-xs sm:text-sm"
                  >
                    {isJoining ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size={16} color="#FFFFFF" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Icon
                          icon="fluent:add-24-filled"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                        <span>Tham gia nhóm</span>
                      </div>
                    )}
                  </TravelButton>
                )}
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                  <Icon
                    icon="fluent:search-24-filled"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
                  />
                </button>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                  <Icon
                    icon="fluent:more-horizontal-24-filled"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700"
                  />
                </button>
              </div>
            </div>
            <div className="flex space-x-1 mt-4 overflow-x-auto">
              {tabs.map((tab) => {
                const isDisabled =
                  groupData.isLocked &&
                  groupData.currentUserRole !== "ADMIN" &&
                  tab.id !== "about";
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    disabled={isDisabled}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-3 font-medium transition-colors flex-shrink-0 whitespace-nowrap ${
                      isDisabled
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 cursor-pointer"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                    }`}
                  >
                    <Icon icon={tab.icon} className="h-5 w-5" />
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {groupData.isLocked && (
          <div className="bg-white p-2">
            <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-[50px]">
              <div className="relative overflow-hidden rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-50">
                      <Icon
                        icon="fluent:lock-closed-24-filled"
                        className="h-5 w-5 text-red-600"
                      />
                    </div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-base font-semibold text-red-900">
                      Nhóm đã bị khóa
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      <span className="font-medium">Lý do: </span>
                      {groupData.moderationReason ||
                        "Nhóm này đã bị khóa bởi quản trị viên."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-3 sm:px-6 lg:px-[50px] py-4 sm:py-6 lg:py-8 mx-auto max-w-[1200px]">
        <Outlet
          context={{
            groupData,
            isMember: groupData?.isMember || false,
            currentUserRole: groupData?.currentUserRole || null,
          }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteGroup}
        type="group"
        itemName={groupData?.groupName || ""}
        showStats={true}
        stats={[
          {
            icon: "fluent:people-24-regular",
            label: "thành viên",
            value: groupData?.memberCount || 0,
          },
          {
            icon: "fluent:document-24-regular",
            label: "bài viết",
            value: groupData?.postsLastMonth || 0,
          },
        ]}
      />

      {/* Edit Group Modal */}
      <GroupEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateGroup}
        initialValues={{
          groupName: groupData?.groupName,
          groupDescription: groupData?.groupDescription || "",
          privacy: groupData?.privacy,
          coverImageUrl: groupData?.coverImageUrl || "",
        }}
      />
    </div>
  );
};

export default GroupDetailPage;
