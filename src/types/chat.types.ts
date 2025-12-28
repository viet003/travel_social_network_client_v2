// Chat Message Types

export interface ChatMessage {
  // MongoDB fields
  id?: string; // MongoDB document ID
  conversationMessageId?: string; // UUID from PostgreSQL
  conversationId: string; // Conversation UUID
  
  // Legacy/compatibility fields
  messageId: string; // Can be either conversationMessageId or id
  mongoId?: string; // MongoDB document ID (same as id)
  groupChatId?: string; // Alias for conversationId
  
  // Sender info
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  
  // Message content
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  
  // Flags
  isEdited?: boolean;
  editedAt?: string;
  
  // Thread support
  replyToMessageId?: string;
  repliedMessageContent?: string; // Content of replied message from server
}

export interface SendMessageRequest {
  groupChatId: string;
  content: string;
  type?: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
}

export interface MessageResponse {
  messageId: string;
  mongoId?: string;
  groupChatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  mediaUrl?: string;
}

export interface TypingNotification {
  userId: string;
  username: string;
  typing: boolean;
  groupChatId: string;
}

export interface MessageDeliveryReceipt {
  messageId: string;
  conversationId: string;
  userId: string;
  username: string;
  type: 'delivered' | 'read';
  timestamp: string;
}

export interface MessageDeliveryRequest {
  messageId: string;
  conversationId: string;
}

export interface GetMessagesParams {
  conversationId: string;
  page?: number;
  size?: number;
}

export interface MessagesPageResponse {
  content: ChatMessage[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
