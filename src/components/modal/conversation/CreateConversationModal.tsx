import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { apiGetMyFriends } from "../../../services/friendshipService";
import { apiCreateGroupConversation } from "../../../services/conversationService";
import type { UserResponse } from "../../../types/friendship.types";
import avatardf from "../../../assets/images/avatar_default.png";

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated?: (conversationId: string) => void;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  isOpen,
  onClose,
  onConversationCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<UserResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch friends list
  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await apiGetMyFriends();
      setFriends(response.data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(
    (friend) =>
      friend.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.userProfile?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Toggle user selection
  const toggleUserSelection = (user: UserResponse) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.userId === user.userId);
      if (exists) {
        return prev.filter((u) => u.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  };

  // Handle create conversation
  const handleCreate = async () => {
    if (selectedUsers.length < 1) {
      alert("Vui lòng chọn ít nhất 1 người để tạo nhóm chat");
      return;
    }

    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm");
      return;
    }

    setCreating(true);
    try {
      const memberIds = selectedUsers.map((u) => u.userId!);
      const response = await apiCreateGroupConversation(groupName, memberIds);
      const conversationId = response.data.conversationId;

      if (onConversationCreated) {
        onConversationCreated(conversationId);
      }
      handleClose();
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert("Không thể tạo cuộc trò chuyện");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedUsers([]);
    setGroupName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white overflow-hidden rounded-t-2xl border-b border-gray-200">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon
                icon="fluent:compass-northwest-24-regular"
                className="text-blue-600 w-7 h-7"
              />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">Tạo nhóm chat mới</h2>
            <p className="text-sm text-gray-500">Chọn bạn bè để tạo cuộc trò chuyện</p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
            onClick={handleClose}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-2 space-y-6">
            {/* Group Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên nhóm
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    icon="fluent:people-team-24-regular"
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Đặt tên cho nhóm..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Search & Selection */}
            <div className="flex flex-col h-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thành viên ({selectedUsers.length})
              </label>

              {/* Search Bar */}
              <div className="relative mb-3 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    icon="fluent:search-24-regular"
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm bạn bè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                />
              </div>

              {/* Selected Users Chips */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto custom-scrollbar">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-700 pl-1.5 pr-2.5 py-1 rounded-full border border-blue-100 animate-in fade-in zoom-in duration-200"
                    >
                      <img
                        src={user.avatarImg || avatardf}
                        alt={user.userName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium max-w-[100px] truncate">
                        {user.userProfile?.fullName || user.userName}
                      </span>
                      <button
                        onClick={() => toggleUserSelection(user)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <Icon
                          icon="fluent:dismiss-12-filled"
                          className="w-3 h-3"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Friends List - Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-2 mx-4 mb-4 border border-gray-100 rounded-xl bg-gray-50/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Icon
                  icon="line-md:loading-loop"
                  className="h-8 w-8 mb-2 text-blue-500"
                />
                <p className="text-sm">Đang tải danh sách...</p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Icon
                  icon="fluent:person-search-24-regular"
                  className="h-10 w-10 mb-2 opacity-50"
                />
                <p className="text-sm">Không tìm thấy bạn bè</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredFriends.map((friend) => {
                  const isSelected = selectedUsers.some(
                    (u) => u.userId === friend.userId
                  );
                  return (
                    <div
                      key={friend.userId}
                      onClick={() => toggleUserSelection(friend)}
                      className={`flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer transition-all duration-200 group ${
                        isSelected ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={friend.avatarImg || avatardf}
                          alt={friend.userName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                            <Icon
                              icon="fluent:checkmark-12-filled"
                              className="w-3 h-3"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isSelected ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {friend.userProfile?.fullName || friend.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{friend.userName}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 group-hover:border-blue-400"
                        }`}
                      >
                        {isSelected && (
                          <Icon
                            icon="fluent:checkmark-12-filled"
                            className="w-3 h-3 text-white"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleCreate}
            disabled={creating || selectedUsers.length < 1 || !groupName.trim()}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200 flex items-center gap-2"
          >
            {creating ? (
              <>
                <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Icon icon="fluent:add-circle-24-filled" className="w-4 h-4" />
                <span>Tạo nhóm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;
