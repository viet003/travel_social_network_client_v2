import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { message as antdMessage } from "antd";
import { apiGetMyFriends } from "../../../services/friendshipService";
import { apiAddMembersToConversation } from "../../../services/conversationService";
import type { UserResponse } from "../../../types/friendship.types";
import avatardf from "../../../assets/images/avatar_default.png";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  currentMemberIds: string[];
  onMembersAdded?: () => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  currentMemberIds,
  onMembersAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<UserResponse[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);

  const loadFriends = useCallback(async () => {
    setIsLoadingFriends(true);
    try {
      const response = await apiGetMyFriends();
      // Filter out users who are already members
      const availableFriends = response.data.filter(
        (friend) => !currentMemberIds.includes(friend.userId!)
      );
      setFriends(availableFriends);
    } catch (error) {
      console.error("Failed to load friends:", error);
      antdMessage.error("Không thể tải danh sách bạn bè");
    } finally {
      setIsLoadingFriends(false);
    }
  }, [currentMemberIds]);

  useEffect(() => {
    if (isOpen) {
      loadFriends();
    }
  }, [isOpen, loadFriends]);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.userProfile?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      antdMessage.warning("Vui lòng chọn ít nhất 1 người");
      return;
    }

    setIsAddingMembers(true);
    try {
      const userIds = selectedUsers.map((u) => u.userId!);
      await apiAddMembersToConversation(conversationId, userIds);
      antdMessage.success("Đã thêm thành viên vào nhóm");
      handleClose();
      if (onMembersAdded) {
        onMembersAdded();
      }
    } catch (error) {
      console.error("Failed to add members:", error);
      antdMessage.error("Không thể thêm thành viên");
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedUsers([]);
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
            <h2 className="text-2xl font-bold text-gray-800">Thêm thành viên</h2>
            <p className="text-sm text-gray-500">
              Chọn bạn bè để thêm vào nhóm
            </p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-2 space-y-4">
            {/* Search Bar */}
            <div className="relative group">
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
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-700 pl-1.5 pr-2.5 py-1 rounded-full border border-blue-100"
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
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors cursor-pointer"
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

          {/* Friends List */}
          <div className="flex-1 overflow-y-auto px-2 mx-4 mb-4 border border-gray-100 rounded-xl bg-gray-50/50">
            {isLoadingFriends ? (
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
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleAddMembers}
            disabled={isAddingMembers || selectedUsers.length === 0}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200 flex items-center gap-2 cursor-pointer"
          >
            {isAddingMembers ? (
              <>
                <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <Icon icon="fluent:person-add-24-filled" className="w-4 h-4" />
                <span>Thêm thành viên</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
