import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { ConversationResponse } from "../../../services/conversationService";
import avatardf from "../../../assets/images/avatar_default.png";

interface ConversationInfoModalProps {
  conversation: ConversationResponse;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationInfoModal: React.FC<ConversationInfoModalProps> = ({
  conversation,
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
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
        <div className="sticky top-0 z-10 flex bg-pink-500 items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 text-white rounded-full hover:bg-white/20 cursor-pointer transition-colors"
              aria-label="Quay lại"
            >
              <Icon icon="fluent:arrow-left-24-filled" className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-start">
              <span className="flex items-center text-sm font-bold text-white">
                <Icon
                  icon="fluent:compass-northwest-24-regular"
                  className="text-white w-4 h-4 mr-1"
                />
                TravelNest
              </span>
              <h2 className="text-base font-bold text-white">
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
              <img
                src={conversationAvatar}
                alt={conversationName}
                className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover mb-3"
              />
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
                <span className="text-sm text-gray-500">0 người</span>
              </div>
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">
                  Chưa có thông tin thành viên
                </p>
              </div>
            </div>
          )}

          {/* Media Section */}
          <div className="p-4 border-b border-gray-200">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Icon icon="lucide:image" className="w-5 h-5" />
              Ảnh & Video
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder for media */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <Icon icon="lucide:image" className="w-8 h-8 text-gray-300" />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-sm text-pink-500 hover:text-pink-600 font-medium cursor-pointer">
              Xem tất cả
            </button>
          </div>

          {/* Files Section */}
          <div className="p-4 border-b border-gray-200">
            <h5 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Icon icon="lucide:file" className="w-5 h-5" />
              File đã chia sẻ
            </h5>
            <div className="text-center py-4">
              <Icon
                icon="lucide:folder-open"
                className="w-12 h-12 text-gray-300 mx-auto mb-2"
              />
              <p className="text-sm text-gray-400">Chưa có file nào</p>
            </div>
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
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer">
                <Icon icon="lucide:bell" className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Tắt thông báo</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer">
                <Icon icon="lucide:search" className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Tìm kiếm trong cuộc trò chuyện
                </span>
              </button>
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
    </>
  );
};

export default ConversationInfoModal;
