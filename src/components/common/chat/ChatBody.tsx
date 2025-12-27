import React, { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { formatTimeAgo } from "../../../utilities/helper";
import avatardf from "../../../assets/images/avatar_default.png";
import MessageContextMenu from "./MessageContextMenu";
import type { ChatMessage } from "../../../types/chat.types";

interface ChatBodyProps {
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  typingUsers: Set<string>;
  currentUserId: string;
  avatar: string;
  name: string;
  onScroll: () => void;
  onRetryMessage: (tempId: string) => void;
  onEditMessage?: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onReplyMessage?: (message: ChatMessage) => void;
  getStatusIcon: (msg: ChatMessage) => React.ReactNode;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  messages,
  isLoadingMessages,
  typingUsers,
  currentUserId,
  avatar,
  name,
  onScroll,
  onRetryMessage,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
  getStatusIcon,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
  } | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null);

  // Long press handlers
  const handleLongPressStart = (
    e: React.MouseEvent | React.TouchEvent,
    messageId: string,
    isOwnMessage: boolean
  ) => {
    if (!isOwnMessage) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    longPressStartRef.current = { x: clientX, y: clientY };

    longPressTimerRef.current = window.setTimeout(() => {
      setContextMenu({
        x: clientX,
        y: clientY,
        messageId,
      });
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressStartRef.current = null;
  };

  const handleLongPressMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!longPressStartRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const deltaX = Math.abs(clientX - longPressStartRef.current.x);
    const deltaY = Math.abs(clientY - longPressStartRef.current.y);

    // Cancel long press if moved too much
    if (deltaX > 10 || deltaY > 10) {
      handleLongPressEnd();
    }
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={messageContainerRef}
      onScroll={onScroll}
      className="overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-gray-50 to-white h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
    >
      {/* Loading State */}
      {isLoadingMessages && (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
              style={{ borderBottomColor: "#0866ff" }}
            ></div>
            <p className="text-sm text-gray-500 mt-2">Đang tải tin nhắn...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingMessages && messages.length === 0 && (
        <div className="flex justify-center h-full items-center">
          <div className="text-center">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200"
            />
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Bạn và {name} đã kết nối trên Travel Social Network
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Bắt đầu cuộc trò chuyện ngay!
            </p>
          </div>
        </div>
      )}

      {/* Message List */}
      {!isLoadingMessages &&
        messages.map((msg) => {
          const isOwnMessage = msg.senderId === currentUserId;

          return (
            <div
              key={msg.messageId}
              className={`flex gap-2 ${
                isOwnMessage ? "flex-row-reverse" : ""
              } group relative mb-1.5`}
              onMouseEnter={() => setHoveredMessageId(msg.messageId)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {/* Avatar - only show for received messages */}
              {!isOwnMessage && (
                <img
                  src={msg.senderAvatar || avatardf}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}

              <div
                className={`flex-1 ${isOwnMessage ? "flex justify-end" : ""}`}
              >
                {/* Sender name - only for received messages */}
                {!isOwnMessage && (
                  <p className="text-xs font-medium text-gray-600 mb-1 ml-2">
                    {msg.senderName}
                  </p>
                )}

                {/* Message bubble wrapper with relative positioning */}
                <div className="relative inline-block">
                  {/* Reply Icon - Show on hover, positioned relative to bubble */}
                  {hoveredMessageId === msg.messageId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onReplyMessage) {
                          onReplyMessage(msg);
                        }
                      }}
                      className={`absolute top-1/2 -translate-y-1/2 z-10 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all ${
                        isOwnMessage ? "-left-7" : "-right-7"
                      }`}
                      title="Trả lời"
                    >
                      <Icon
                        icon="lucide:corner-up-left"
                        className="w-3.5 h-3.5 text-gray-600"
                      />
                    </button>
                  )}

                  {/* Outer wrapper for bubble and timestamp */}
                  <div className={msg.status === "sending" ? "opacity-40" : ""}>
                    {/* Message bubble */}
                    <div
                      className={`${
                        msg.type === "image" && msg.mediaUrl
                          ? "rounded-2xl inline-block transition-all duration-200 cursor-pointer select-none shadow-sm hover:shadow-lg max-w-[300px]"
                          : `rounded-2xl px-4 py-2.5 shadow-sm min-w-[100px] max-w-[80%] inline-block transition-all duration-200 cursor-pointer select-none ${
                              isOwnMessage
                                ? msg.status === "failed"
                                  ? "bg-red-100 text-red-800 border border-red-300 max-w-[300px]"
                                  : "text-white shadow-md hover:shadow-lg max-w-[300px]"
                                : "bg-white text-gray-800 border border-gray-100 shadow-sm hover:shadow-md max-w-[300px]"
                            }`
                      }`}
                      style={
                        msg.type === "image" && msg.mediaUrl
                          ? undefined
                          : isOwnMessage && msg.status !== "failed"
                          ? { backgroundColor: "#0866ff" }
                          : undefined
                      }
                      onMouseDown={(e) =>
                        handleLongPressStart(e, msg.messageId, isOwnMessage)
                      }
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onMouseMove={handleLongPressMove}
                      onTouchStart={(e) =>
                        handleLongPressStart(e, msg.messageId, isOwnMessage)
                      }
                      onTouchEnd={handleLongPressEnd}
                      onTouchMove={handleLongPressMove}
                    >
                      {/* Reply Preview - Show if replying to another message */}
                      {msg.replyToMessageId &&
                        (() => {
                          // Use server-provided content if available, otherwise search in messages
                          const repliedContent =
                            msg.repliedMessageContent ||
                            messages.find(
                              (m) =>
                                m.id === msg.replyToMessageId ||
                                m.mongoId === msg.replyToMessageId ||
                                m.messageId === msg.replyToMessageId ||
                                m.conversationMessageId === msg.replyToMessageId
                            )?.content;

                          return (
                            <div className="mb-2 pb-2 border-b border-white/20">
                              <div className="flex items-center gap-2 opacity-80">
                                <Icon
                                  icon="lucide:corner-up-left"
                                  className="w-3 h-3 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs truncate opacity-70">
                                    {repliedContent || "Tin nhắn"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                      {/* Message Content - Handle text and images */}
                      {msg.type === "image" && msg.mediaUrl ? (
                        <img
                          src={msg.mediaUrl}
                          alt="Sent image"
                          className="rounded-lg max-w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(msg.mediaUrl, "_blank")}
                        />
                      ) : (
                        <p className="text-sm break-words">{msg.content}</p>
                      )}

                      {/* Retry button for failed messages */}
                      {isOwnMessage && msg.status === "failed" && (
                        <button
                          onClick={() => onRetryMessage(msg.messageId)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1 flex items-center gap-1"
                        >
                          <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
                          Thử lại
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Timestamp - Show above message bubble */}
                  <div
                    className={`flex items-center gap-1.5 mb-1 ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p className="text-xs pl-2 font-medium text-gray-500">
                      {formatTimeAgo(msg.createdAt)}
                    </p>
                    {isOwnMessage && (
                      <span className="text-gray-500">
                        {getStatusIcon(msg)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="flex gap-2 animate-fade-in">
          <img
            src={avatar}
            alt=""
            className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-gray-200"
          />
          <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      {/* Context Menu */}
      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={() => {
            if (onEditMessage) {
              onEditMessage(contextMenu.messageId);
            }
            setContextMenu(null);
          }}
          onDelete={() => {
            if (onDeleteMessage) {
              onDeleteMessage(contextMenu.messageId);
            }
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default ChatBody;
