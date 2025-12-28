import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { message as antdMessage } from "antd";
import type { ConversationResponse } from "../../../types/conversation.types";
import {
  apiGetConversationMembers,
  apiGetConversationMedia,
  apiUpdateGroupAvatar,
  apiRemoveMembersFromConversation,
  apiDeleteConversation,
  apiGetConversationById,
} from "../../../services/conversationService";
import { setActiveConversation } from "../../../stores/actions/conversationAction";
import AddMembersModal from "../../modal/conversation/AddMembersModal";
import CreateConversationModal from "../../modal/conversation/CreateConversationModal";
import ConfirmDeleteModal from "../../modal/confirm/ConfirmDeleteModal";
import avatardf from "../../../assets/images/avatar_default.png";
import { path } from "../../../utilities/path";

interface ConversationInfoModalProps {
  conversation: ConversationResponse;
  isOpen: boolean;
  onClose: () => void;
  onConversationUpdated?: (updatedConversation: ConversationResponse) => void;
}

interface MediaItem {
  mediaId: string;
  url: string;
  type: string;
  createdAt: string;
}

interface MemberItem {
  conversationMemberId: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  joinedAt: string;
}

const ConversationInfoModal: React.FC<ConversationInfoModalProps> = ({
  conversation,
  isOpen,
  onClose,
  onConversationUpdated,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [membersCount, setMembersCount] = useState(0);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<MemberItem | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const loadMembers = useCallback(async () => {
    if (conversation.type !== "GROUP") return;

    setIsLoadingMembers(true);
    try {
      const response = await apiGetConversationMembers(
        conversation.conversationId,
        0,
        50
      );
      setMembers(response.data.content || []);
      setMembersCount(response.data.totalElements || 0);
    } catch (error) {
      console.error("Failed to load members:", error);
      antdMessage.error("Không thể tải danh sách thành viên");
    } finally {
      setIsLoadingMembers(false);
    }
  }, [conversation.type, conversation.conversationId]);

  const loadMedia = useCallback(async () => {
    setIsLoadingMedia(true);
    try {
      const response = await apiGetConversationMedia(
        conversation.conversationId
      );
      setMedia(response.data || []);
    } catch (error) {
      console.error("Failed to load media:", error);
      antdMessage.error("Không thể tải danh sách media");
    } finally {
      setIsLoadingMedia(false);
    }
  }, [conversation.conversationId]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });

      // Load members and media when modal opens
      loadMembers();
      loadMedia();
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, loadMembers, loadMedia]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleMembersAdded = () => {
    // Reload members list after adding
    loadMembers();
  };

  const handleAvatarClick = () => {
    if (conversation.type === "GROUP") {
      avatarInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      antdMessage.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      antdMessage.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await apiUpdateGroupAvatar(conversation.conversationId, file);
      antdMessage.success("Đã cập nhật ảnh nhóm");
      // Update avatar locally or reload conversation
      window.location.reload(); // Temporary solution, better to update state
    } catch (error) {
      console.error("Failed to update avatar:", error);
      antdMessage.error("Không thể cập nhật ảnh nhóm");
    } finally {
      setIsUploadingAvatar(false);
      // Reset input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemoveMember = (member: MemberItem) => {
    // Don't allow removing admin
    if (member.role === "ADMIN") {
      antdMessage.warning("Không thể xóa quản trị viên");
      return;
    }

    setMemberToRemove(member);
    setShowConfirmRemove(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsRemovingMember(true);
    try {
      await apiRemoveMembersFromConversation(
        conversation.conversationId,
        [memberToRemove.userId]
      );
      antdMessage.success("Đã xóa thành viên khỏi nhóm");
      // Reload members list
      loadMembers();
    } catch (error: unknown) {
      console.error("Failed to remove member:", error);
      const errorMessage = (error && typeof error === 'object' && 'message' in error) 
        ? (error as { message: string }).message 
        : "Không thể xóa thành viên";
      antdMessage.error(errorMessage);
    } finally {
      setIsRemovingMember(false);
    }
  };

  if (!shouldRender) return null;

  const conversationName = conversation.conversationName || "Conversation";
  const conversationAvatar = conversation.conversationAvatar || avatardf;

  return (
    <>
      {/* Modal - Replace ChatWidget position */}
      <div
        className={`fixed bottom-0 right-6 z-50 flex flex-col w-[400px] overflow-hidden bg-white rounded-t-lg border border-gray-200 transition-all duration-300 ease-in-out ${
          isAnimating
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex bg-blue-500 items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-7 h-7 text-white rounded-full hover:bg-white/20 cursor-pointer transition-colors"
              aria-label="Quay lại"
            >
              <Icon icon="fluent:arrow-left-24-filled" className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-start">
              <span className="flex items-center mb-1 text-lg font-bold text-white">
                <Icon
                  icon="fluent:compass-northwest-24-regular"
                  className="text-white w-5 h-5"
                />
                TravelNest
              </span>
              <h2 className="text-sm font-semibold text-white">
                Thông tin cuộc trò chuyện
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[460px]">
          {/* Conversation Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <img
                  src={conversationAvatar}
                  alt={conversationName}
                  className={`w-20 h-20 rounded-full border-2 border-gray-200 object-cover mb-3 ${
                    conversation.type === "GROUP" ? "cursor-pointer" : ""
                  }`}
                  onClick={handleAvatarClick}
                />
                {conversation.type === "GROUP" && (
                  <>
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center mb-3 cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      {isUploadingAvatar ? (
                        <Icon
                          icon="line-md:loading-loop"
                          className="w-6 h-6 text-white"
                        />
                      ) : (
                        <Icon
                          icon="fluent:camera-24-filled"
                          className="w-6 h-6 text-white"
                        />
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                {conversationName}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {conversation.type === "PRIVATE"
                  ? "Trò chuyện riêng tư"
                  : "Nhóm chat"}
              </p>
            </div>
          </div>

          {/* Members Section */}
          {conversation.type === "GROUP" && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Icon icon="lucide:users" className="w-5 h-5" />
                  Thành viên
                </h5>
                <span className="text-sm text-gray-500">
                  {membersCount} người
                </span>
              </div>
              {isLoadingMembers ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-sm text-gray-400 mt-2">Đang tải...</p>
                </div>
              ) : members.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {members.map((member) => (
                    <div
                      key={member.conversationMemberId}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <img
                        src={member.avatarUrl || avatardf}
                        alt={member.username}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                        onClick={() => {
                          const targetUrl = `${path.HOME}/user/${member.userId}`;
                          dispatch(setActiveConversation(null));
                          handleClose();
                          setTimeout(() => navigate(targetUrl), 350);
                        }}
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          const targetUrl = `${path.HOME}/user/${member.userId}`;
                          dispatch(setActiveConversation(null));
                          handleClose();
                          setTimeout(() => navigate(targetUrl), 350);
                        }}
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {member.fullName || member.username}
                          {member.role === "ADMIN" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                              Quản trị viên
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{member.username}
                        </p>
                      </div>
                      {conversation.groupOwner && member.role !== "ADMIN" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMember(member);
                          }}
                          className="flex-shrink-0 opacity-50 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                          aria-label="Xóa thành viên"
                          title="Xóa thành viên khỏi nhóm"
                        >
                          <Icon
                            icon="fluent:dismiss-circle-24-regular"
                            className="w-5 h-5 text-red-500"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">
                    Chưa có thông tin thành viên
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Media Section */}
          <div className="p-4 border-b border-gray-200">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Icon icon="lucide:image" className="w-5 h-5" />
              Ảnh & Video ({media.length})
            </h5>
            {isLoadingMedia ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">Đang tải...</p>
              </div>
            ) : media.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {media.slice(0, 6).map((item) => (
                    <div
                      key={item.mediaId}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <img
                        src={item.url}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {media.length > 6 && (
                  <button className="w-full mt-3 text-sm text-pink-500 hover:text-pink-600 font-medium cursor-pointer">
                    Xem tất cả ({media.length})
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <Icon
                  icon="lucide:image"
                  className="w-12 h-12 text-gray-300 mx-auto mb-2"
                />
                <p className="text-sm text-gray-400">Chưa có ảnh hoặc video</p>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="p-4">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Icon icon="lucide:settings" className="w-5 h-5" />
              Cài đặt
            </h5>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer">
                <Icon icon="lucide:users" className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {conversation.type === "PRIVATE"
                    ? "Xem thông tin người dùng"
                    : "Xem thành viên nhóm"}
                </span>
              </button>
              {conversation.type === "GROUP" && (
                <button
                  onClick={() => setShowAddMembersModal(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <Icon
                    icon="fluent:person-add-24-regular"
                    className="w-5 h-5 text-gray-600"
                  />
                  <span className="text-sm text-gray-700">Thêm thành viên</span>
                </button>
              )}
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer">
                <Icon icon="lucide:search" className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Tìm kiếm trong cuộc trò chuyện
                </span>
              </button>
              {conversation.type === "GROUP" && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Icon icon="fluent:edit-24-regular" className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Chỉnh sửa nhóm</p>
                      <p className="text-xs text-gray-500">Thay đổi tên nhóm</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Icon icon="fluent:delete-24-regular" className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600">Xóa nhóm</p>
                      <p className="text-xs text-red-400">Xóa vĩnh viễn nhóm chat</p>
                    </div>
                  </button>
                </>
              )}
              {conversation.type === "PRIVATE" && (
                <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer">
                  <Icon icon="lucide:user-x" className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-600">Chặn người dùng</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddMembersModal}
        onClose={() => setShowAddMembersModal(false)}
        conversationId={conversation.conversationId}
        currentMemberIds={members.map((m) => m.userId)}
        onMembersAdded={handleMembersAdded}
      />

      {/* Confirm Remove Member Modal */}
      <ConfirmDeleteModal
        isOpen={showConfirmRemove}
        onClose={() => {
          setShowConfirmRemove(false);
          setMemberToRemove(null);
        }}
        onConfirm={confirmRemoveMember}
        type="custom"
        itemName={memberToRemove?.fullName || memberToRemove?.username || ""}
        customTitle="Xóa thành viên khỏi nhóm"
        customWarning="Thành viên này sẽ bị xóa khỏi nhóm và không thể nhận tin nhắn mới. Bạn có thể thêm lại họ sau."
        isDeleting={isRemovingMember}
      />

      {/* Edit Group Name Modal */}
      <CreateConversationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onConversationUpdated={async () => {
          try {
            // Reload conversation data
            const response = await apiGetConversationById(conversation.conversationId);
            const updatedConversation = response.data;
            
            setShowEditModal(false);
            antdMessage.success("Đã cập nhật tên nhóm");
            
            // Notify parent component to update conversation list
            onConversationUpdated?.(updatedConversation);
          } catch (error) {
            console.error("Failed to reload conversation:", error);
          }
        }}
        editMode={true}
        conversation={conversation}
      />

      {/* Delete Conversation Confirmation */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          try {
            await apiDeleteConversation(conversation.conversationId);
            antdMessage.success("Đã xóa nhóm chat");
            setShowDeleteConfirm(false);
            onClose();
          } catch (error) {
            antdMessage.error("Không thể xóa nhóm chat");
          }
        }}
        type="custom"
        itemName={conversation.conversationName || "nhóm chat"}
        customTitle="Xóa nhóm chat"
        customWarning="Nhóm chat này sẽ bị xóa vĩnh viễn. Tất cả tin nhắn và thành viên sẽ bị xóa. Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default ConversationInfoModal;
