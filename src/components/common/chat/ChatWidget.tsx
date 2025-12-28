import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { message as antdMessage } from "antd";
import type { RootState } from "../../../stores/types/storeTypes";
import { setActiveConversation, updateConversation } from "../../../stores/actions/conversationAction";
import ConversationInfoModal from "../../modal/conversation/ConversationInfoModal";
import ChatBody from "./ChatBody";
import avatardf from "../../../assets/images/avatar_default.png";
import webSocketService from "../../../services/webSocketService";
import { apiGetConversationMessages, apiUpdateMessage, apiDeleteMessage } from "../../../services/conversationMessageService";
import { apiUploadMedia } from "../../../services/mediaService";
import type {
  ChatMessage,
  TypingNotification,
  MessageDeliveryReceipt,
} from "../../../types/chat.types";

interface ChatWidgetProps {
  onClose?: () => void;
}

interface PendingMessage {
  tempId: string;
  content: string;
  retryCount: number;
  timestamp: number;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [messageStatuses, setMessageStatuses] = useState<Map<string, string>>(
    new Map()
  );
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const readReceiptsSentRef = useRef<Set<string>>(new Set()); // Track sent read receipts

  // Get active conversation from Redux
  const { activeConversationId, conversations } = useSelector(
    (state: RootState) => state.conversation
  );

  // Get current user info
  const currentUserId = useSelector((state: RootState) => state.auth?.userId);

  // Debug logging
  useEffect(() => {
  }, [activeConversationId, conversations]);

  // Find active conversation
  const activeConversation = conversations.find(
    (conv) => conv.conversationId === activeConversationId
  );

  // Get conversation name and avatar
  const getConversationDisplay = () => {
    if (!activeConversation) return { name: "Chat", avatar: avatardf };

    if (activeConversation.type === "PRIVATE") {
      return {
        name: activeConversation.conversationName || "User",
        avatar: activeConversation.conversationAvatar || avatardf,
      };
    } else {
      return {
        name: activeConversation.conversationName || "Group Chat",
        avatar: activeConversation.conversationAvatar || avatardf,
      };
    }
  };

  const { name, avatar } = getConversationDisplay();

  // Check if user is near bottom of messages
  const checkIfNearBottom = useCallback(() => {
    if (!messageContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsNearBottom(distanceFromBottom < 100);
  }, []);

  // Auto scroll to bottom when new messages arrive (only if near bottom)
  const scrollToBottom = useCallback(
    (force = false) => {
      if (force || isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isNearBottom]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    // Clear read receipts tracking when switching conversations
    readReceiptsSentRef.current.clear();

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await apiGetConversationMessages({
          conversationId: activeConversationId,
          page: 0,
          size: 50,
        });
        setMessages(response.content);
        // Mark messages as delivered when loaded
        response.content.forEach((msg) => {
          if (msg.senderId !== currentUserId && msg.mongoId) {
            webSocketService.sendMessageDelivered(
              msg.mongoId,
              activeConversationId
            );
          }
        });
      } catch (error) {
        console.error("❌ Failed to load messages:", error);
        antdMessage.error("Không thể tải tin nhắn");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  // Subscribe to WebSocket for real-time messages
  useEffect(() => {
    if (!activeConversationId) return;
    // Subscribe to conversation
    const unsubscribeConversation =
      webSocketService.subscribeToConversation(activeConversationId);

    // Handle incoming messages
    const unsubscribeMessages = webSocketService.onChatMessage(
      activeConversationId,
      (newMessage: ChatMessage) => {
        // Note: Server automatically sends notification to user's notification queue
        // No need to manually notify here - useUnreadMessages hook handles it
        
        setMessages((prev) => {
          // Check if this is our own message echoed back (replace optimistic message)
          if (newMessage.senderId === currentUserId) {
            // Find and replace optimistic message with same content and senderId
            // Match by content only (ignore status since we might have already updated it to "sent")
            const optimisticIndex = prev.findIndex(
              (m) =>
                m.senderId === currentUserId &&
                m.content === newMessage.content &&
                m.messageId.startsWith("temp-") &&
                !m.mongoId // Ensure it's still a temporary message without server ID
            );

            if (optimisticIndex !== -1) {
              // Replace optimistic message with real one
              const updated = [...prev];
              updated[optimisticIndex] = {
                ...newMessage,
                status: "sent", // Update status to sent
              };
              return updated;
            }
          }

          // Check if message already exists by messageId or mongoId (avoid duplicates)
          const exists = prev.some(
            (m) =>
              m.messageId === newMessage.messageId ||
              (m.mongoId && m.mongoId === newMessage.mongoId) ||
              (newMessage.conversationMessageId &&
                m.conversationMessageId === newMessage.conversationMessageId)
          );
          if (exists) {
            return prev;
          }

          // Send delivery confirmation for received messages
          if (newMessage.senderId !== currentUserId && newMessage.mongoId) {
            webSocketService.sendMessageDelivered(
              newMessage.mongoId,
              activeConversationId
            );
          }

          return [...prev, newMessage];
        });

        scrollToBottom(true);
      }
    );

    // Handle typing notifications
    const unsubscribeTyping = webSocketService.onTypingNotification(
      activeConversationId,
      (notification: TypingNotification) => {
        // Ignore own typing
        if (notification.userId === currentUserId) return;

        // Update typing users
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (notification.typing) {
            newSet.add(notification.userId);
          } else {
            newSet.delete(notification.userId);
          }
          return newSet;
        });

        // Auto-clear typing indicator after 5 seconds
        setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(notification.userId);
            return newSet;
          });
        }, 5000);
      }
    );

    const unsubscribeReceipts = webSocketService.onDeliveryReceipt(
      activeConversationId,
      (receipt: MessageDeliveryReceipt) => {
        // Update message status
        setMessageStatuses((prev) => {
          const newMap = new Map(prev);
          newMap.set(receipt.messageId, receipt.type);
          return newMap;
        });

        // Update message in list
        setMessages((prev) =>
          prev.map((msg) =>
            msg.mongoId === receipt.messageId
              ? { ...msg, status: receipt.type as 'delivered' | 'read' }
              : msg
          )
        );
      }
    );

    // Cleanup on unmount or conversation change
    return () => {
      unsubscribeConversation();
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeReceipts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, currentUserId]);

  // Mark messages as read when they become visible
  useEffect(() => {
    if (!activeConversationId || !currentUserId) return;

    const markVisibleMessagesAsRead = () => {
      messages.forEach((msg) => {
        if (
          msg.senderId !== currentUserId &&
          msg.mongoId &&
          msg.status !== "read" &&
          !readReceiptsSentRef.current.has(msg.mongoId) // Check if already sent
        ) {
          webSocketService.sendMessageRead(msg.mongoId, activeConversationId);
          readReceiptsSentRef.current.add(msg.mongoId); // Mark as sent
        }
      });
    };

    // Mark as read after a short delay
    const timer = setTimeout(markVisibleMessagesAsRead, 1000);
    return () => clearTimeout(timer);
  }, [messages, activeConversationId, currentUserId]);

  // Retry failed messages
  const retryPendingMessages = useCallback(async () => {
    if (pendingMessages.length === 0 || !activeConversationId) return;

    for (const pending of pendingMessages) {
      if (pending.retryCount >= 3) {
        console.error("❌ Max retries reached for message:", pending.tempId);
        antdMessage.error("Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối.");
        continue;
      }

      try {
        webSocketService.sendMessage(activeConversationId, pending.content);

        // Remove from pending on success
        setPendingMessages((prev) =>
          prev.filter((p) => p.tempId !== pending.tempId)
        );
      } catch (error) {
        console.error("❌ Retry failed:", error);
        // Increment retry count
        setPendingMessages((prev) =>
          prev.map((p) =>
            p.tempId === pending.tempId
              ? { ...p, retryCount: p.retryCount + 1 }
              : p
          )
        );
      }
    }
  }, [pendingMessages, activeConversationId]);

  // Auto-retry on reconnection
  useEffect(() => {
    if (webSocketService.isConnected() && pendingMessages.length > 0) {
      retryPendingMessages();
    }
  }, [pendingMessages, retryPendingMessages]);

  // Handle close
  const handleClose = () => {
    dispatch(setActiveConversation(null));
    onClose?.();
  };

  // Handle minimize/maximize
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!activeConversationId) return;

    // Send typing notification
    webSocketService.sendTypingNotification(activeConversationId, true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      webSocketService.sendTypingNotification(activeConversationId, false);
    }, 3000) as unknown as number;
  }, [activeConversationId]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      antdMessage.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      antdMessage.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle send image message
  const handleSendImageMessage = async () => {
    if (!selectedImage || !activeConversationId) return;

    const tempId = `temp-${Date.now()}`;
    setIsUploadingImage(true);

    try {
      // Upload image to MinIO
      antdMessage.loading({ content: 'Đang tải ảnh lên...', key: 'upload' });
      const uploadResponse = await apiUploadMedia(selectedImage, 'chat', activeConversationId);
      const imageUrl = uploadResponse.data.url;
      
      antdMessage.success({ content: 'Tải ảnh lên thành công!', key: 'upload', duration: 2 });

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        messageId: tempId,
        conversationId: activeConversationId,
        groupChatId: activeConversationId,
        senderId: currentUserId || "",
        senderName: "You",
        content: messageText.trim() || "Đã gửi một ảnh",
        type: "image",
        status: "sending",
        mediaUrl: imageUrl,
        createdAt: new Date().toISOString(),
        replyToMessageId: replyingTo?.mongoId || replyingTo?.id,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      
      // Clear states
      setSelectedImage(null);
      setImagePreview(null);
      setMessageText("");
      setReplyingTo(null);

      // Send message via WebSocket
      const replyToId = replyingTo?.mongoId || replyingTo?.id;
      webSocketService.sendMessage(
        activeConversationId, 
        messageText.trim() || "Đã gửi một ảnh", 
        'image', 
        imageUrl, 
        replyToId
      );
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Cancel image selection
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message with error handling and retry
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If editing, update the message instead
    if (editingMessage && editingMessage.mongoId) {
      const newContent = messageText.trim();
      if (!newContent) return;

      try {
        await apiUpdateMessage(editingMessage.mongoId, newContent);
        
        // Update message in local state
        setMessages((prev) =>
          prev.map((m) =>
            m.mongoId === editingMessage.mongoId
              ? { ...m, content: newContent }
              : m
          )
        );
        
        setMessageText("");
        setEditingMessage(null);
        antdMessage.success("Đã cập nhật tin nhắn");
      } catch (error) {
        console.error("Failed to update message:", error);
        antdMessage.error("Không thể cập nhật tin nhắn");
      }
      return;
    }
    
    // If there's an image, upload it first
    if (selectedImage) {
      await handleSendImageMessage();
      return;
    }
    
    if (!messageText.trim() || !activeConversationId) return;

    const content = messageText.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI update
    const optimisticMessage: ChatMessage = {
      messageId: tempId,
      conversationId: activeConversationId,
      groupChatId: activeConversationId,
      senderId: currentUserId || "",
      senderName: "You",
      content,
      type: "text",
      status: "sending",
      createdAt: new Date().toISOString(),
      replyToMessageId: replyingTo?.mongoId || replyingTo?.id, // Use mongoId for MongoDB reference
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageText("");
    setReplyingTo(null); // Clear reply state

    // Stop typing notification
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    webSocketService.sendTypingNotification(activeConversationId, false);

    try {
      // Check connection
      if (!webSocketService.isConnected()) {
        throw new Error("WebSocket not connected");
      }

      // Send message via WebSocket with reply info
      const replyToId = replyingTo?.mongoId || replyingTo?.id;
      webSocketService.sendMessage(activeConversationId, content, 'text', undefined, replyToId);

      // Don't update status here - let the server broadcast handle it
    } catch (error) {
      console.error("❌ Failed to send message:", error);

      // Update status to failed
      setMessages((prev) =>
        prev.map((m) =>
          m.messageId === tempId ? { ...m, status: "failed" } : m
        )
      );

      // Add to pending messages for retry
      setPendingMessages((prev) => [
        ...prev,
        {
          tempId,
          content,
          retryCount: 0,
          timestamp: Date.now(),
        },
      ]);

      antdMessage.error("Không thể gửi tin nhắn. Đang thử lại...");
    }

    scrollToBottom(true);
  };

  // Handle edit message - enter edit mode
  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find(
      (m) => m.messageId === messageId || m.mongoId === messageId
    );
    
    if (!messageToEdit) return;
    
    setEditingMessage(messageToEdit);
    setMessageText(messageToEdit.content);
    setReplyingTo(null);
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    const messageToDelete = messages.find(
      (m) => m.messageId === messageId || m.mongoId === messageId
    );
    
    if (!messageToDelete || !messageToDelete.mongoId) {
      antdMessage.error("Không thể xóa tin nhắn");
      return;
    }

    try {
      await apiDeleteMessage(messageToDelete.mongoId);
      
      // Remove message from local state
      setMessages((prev) => prev.filter(
        (m) => m.mongoId !== messageToDelete.mongoId && m.messageId !== messageId
      ));
      
      antdMessage.success("Đã xóa tin nhắn");
    } catch (error) {
      console.error("Failed to delete message:", error);
      antdMessage.error("Không thể xóa tin nhắn");
    }
  };

  // Retry a specific failed message
  const handleRetryMessage = (tempId: string) => {
    const pending = pendingMessages.find((p) => p.tempId === tempId);
    if (!pending || !activeConversationId) return;

    try {
      webSocketService.sendMessage(activeConversationId, pending.content);
      setPendingMessages((prev) => prev.filter((p) => p.tempId !== tempId));
      setMessages((prev) =>
        prev.map((m) => (m.messageId === tempId ? { ...m, status: "sent" } : m))
      );
    } catch (error) {
      console.error("❌ Manual retry failed:", error);
      antdMessage.error("Vẫn không thể gửi. Vui lòng kiểm tra kết nối.");
    }
  };

  // Get message status icon
  const getStatusIcon = (msg: ChatMessage) => {
    const status = messageStatuses.get(msg.mongoId || "") || msg.status;

    switch (status) {
      case "sending":
        return <Icon icon="lucide:clock" className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <Icon icon="lucide:check" className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return (
          <Icon icon="lucide:check-check" className="w-3 h-3 text-gray-400" />
        );
      case "read":
        return (
          <Icon icon="lucide:check-check" className="w-3 h-3 text-blue-500" />
        );
      case "failed":
        return (
          <Icon icon="lucide:alert-circle" className="w-3 h-3 text-red-500" />
        );
      default:
        return null;
    }
  };

  // Don't render if no active conversation ID
  if (!activeConversationId) {
    return null;
  }

  // If we have ID but no conversation data yet, show loading state
  if (!activeConversation) {
    return (
      <div className="fixed bottom-0 right-6 z-[10] flex flex-col w-[400px] max-h-[600px] bg-white rounded-t-lg shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 rounded-t-lg bg-pink-500">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-white font-semibold text-sm">Đang tải...</div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Đóng"
          >
            <Icon icon="lucide:x" className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: '#0866ff' }}></div>
          <p className="text-sm text-gray-500 mt-2">
            Đang tải cuộc trò chuyện...
          </p>
        </div>
      </div>
    );
  }
  // Don't show ChatWidget if InfoModal is open
  if (showInfoModal) {
    return (
      <ConversationInfoModal
        conversation={activeConversation}
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onConversationUpdated={(updatedConversation) => {
          // Update conversation in Redux store
          dispatch(updateConversation(updatedConversation));
        }}
      />
    );
  }

  return (
    <div className="fixed bottom-0 right-6 z-[50] flex flex-col max-w-[400px] w-full bg-white max-h-[560px] rounded-t-lg shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 rounded-t-lg" style={{ backgroundColor: '#0866ff' }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {name}
            </h3>
            <p className="text-white/80 text-xs">
              {webSocketService.isConnected()
                ? "Đang hoạt động"
                : "Đang kết nối..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Thông tin"
          >
            <Icon icon="lucide:info" className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleToggleMinimize}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title={isMinimized ? "Mở rộng" : "Thu gọn"}
          >
            <Icon
              icon={isMinimized ? "lucide:maximize-2" : "lucide:minimize-2"}
              className="w-5 h-5 text-white"
            />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Đóng"
          >
            <Icon icon="lucide:x" className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Body - Only show when not minimized */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <ChatBody
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            typingUsers={typingUsers}
            currentUserId={currentUserId || ""}
            avatar={avatar}
            name={name}
            onScroll={checkIfNearBottom}
            onRetryMessage={handleRetryMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onReplyMessage={(message) => {
              setReplyingTo(message);
            }}
            getStatusIcon={getStatusIcon}
          />

          {/* Connection Status Banner */}
          {!webSocketService.isConnected() && (
            <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2 flex items-center gap-2">
              <Icon
                icon="lucide:wifi-off"
                className="w-4 h-4 text-yellow-600"
              />
              <p className="text-xs text-yellow-700">
                Đang kết nối lại... Tin nhắn sẽ được gửi khi kết nối thành công.
              </p>
            </div>
          )}

          {/* Edit Mode Preview */}
          {editingMessage && (
            <div className="px-3 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon icon="lucide:edit-3" className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-700 truncate">
                    Chỉnh sửa tin nhắn
                  </p>
                  <p className="text-xs text-blue-600 truncate">
                    {editingMessage.content}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingMessage(null);
                  setMessageText("");
                }}
                className="p-1 hover:bg-blue-200 rounded-full transition-colors ml-2 flex-shrink-0"
                type="button"
              >
                <Icon icon="lucide:x" className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          )}

          {/* Reply Preview */}
          {replyingTo && !editingMessage && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon icon="lucide:corner-up-left" className="w-3 h-3 text-gray-500 flex-shrink-0" />
                {replyingTo.senderAvatar && (
                  <img
                    src={replyingTo.senderAvatar}
                    alt={replyingTo.senderName}
                    className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600 truncate">
                    Trả lời {replyingTo.senderName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {replyingTo.content}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-2 flex-shrink-0"
                type="button"
              >
                <Icon icon="lucide:x" className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-[200px] max-h-[200px] rounded-lg border border-gray-300"
                />
                <button
                  onClick={handleCancelImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              </div>
              {messageText && (
                <p className="mt-2 text-sm text-gray-600">{messageText}</p>
              )}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 p-3 bg-white border-t border-gray-200"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Gửi ảnh"
            >
              <Icon icon="lucide:image" className="w-5 h-5 text-gray-500" />
            </button>

            <input
              type="text"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              placeholder={editingMessage ? "Chỉnh sửa tin nhắn..." : "Aa"}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2" style={{ '--tw-ring-color': editingMessage ? '#3b82f6' : '#0866ff' } as React.CSSProperties}
            />

            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Emoji"
            >
              <Icon icon="lucide:smile" className="w-5 h-5 text-gray-500" />
            </button>

            <button
              type="submit"
              disabled={(!messageText.trim() && !selectedImage) || isUploadingImage}
              className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
              style={{ backgroundColor: (messageText.trim() || selectedImage) && !isUploadingImage ? (editingMessage ? '#3b82f6' : '#0866ff') : 'transparent' }}
              title={editingMessage ? "Cập nhật" : "Gửi"}
            >
              {isUploadingImage ? (
                <Icon icon="eos-icons:loading" className="w-5 h-5 text-blue-600" />
              ) : editingMessage ? (
                <Icon
                  icon="lucide:check"
                  className="w-5 h-5"
                  style={{ color: messageText.trim() ? 'white' : '#6b7280' }}
                />
              ) : (
                <Icon
                  icon="lucide:send"
                  className="w-5 h-5"
                  style={{ color: (messageText.trim() || selectedImage) ? 'white' : '#6b7280' }}
                />
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
