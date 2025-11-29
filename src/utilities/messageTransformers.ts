import type { ChatMessage } from '../types/chat.types';

/**
 * Transform MongoDB ConversationMessageDocument to ChatMessage
 * Handles field name mapping between backend and frontend
 */
export const transformMongoMessageToChat = (mongoMessage: any): ChatMessage => {
  return {
    // Map MongoDB fields to ChatMessage interface
    id: mongoMessage.id,
    conversationMessageId: mongoMessage.conversationMessageId,
    conversationId: mongoMessage.conversationId,
    
    // Compatibility fields
    messageId: mongoMessage.conversationMessageId || mongoMessage.id,
    mongoId: mongoMessage.id,
    groupChatId: mongoMessage.conversationId,
    
    // Sender info
    senderId: mongoMessage.senderId,
    senderName: mongoMessage.senderName,
    senderAvatar: mongoMessage.senderAvatar,
    
    // Message content
    content: mongoMessage.content,
    type: mongoMessage.type || 'text',
    status: mongoMessage.status || 'sent',
    mediaUrl: mongoMessage.mediaUrl,
    
    // Timestamps
    createdAt: mongoMessage.createdAt,
    updatedAt: mongoMessage.updatedAt,
    
    // Flags
    isEdited: mongoMessage.isEdited,
    editedAt: mongoMessage.editedAt,
    
    // Thread support
    replyToMessageId: mongoMessage.replyToMessageId,
    repliedMessageContent: mongoMessage.repliedMessageContent,
  };
};

/**
 * Transform array of MongoDB messages to ChatMessage array
 */
export const transformMongoMessagesToChat = (mongoMessages: any[]): ChatMessage[] => {
  return mongoMessages.map(transformMongoMessageToChat);
};

/**
 * Transform WebSocket MessageResponse to ChatMessage
 */
export const transformMessageResponseToChat = (response: any): ChatMessage => {
  return {
    // MongoDB fields
    id: response.mongoId,
    conversationMessageId: response.messageId,
    conversationId: response.groupChatId,
    
    // Compatibility fields
    messageId: response.messageId,
    mongoId: response.mongoId,
    groupChatId: response.groupChatId,
    
    // Sender info
    senderId: response.senderId,
    senderName: response.senderName,
    senderAvatar: response.senderAvatar,
    
    // Message content
    content: response.content,
    type: response.type || 'text',
    status: response.status || 'sent',
    mediaUrl: response.mediaUrl,
    
    // Timestamps
    createdAt: response.createdAt,
    
    // Thread support
    replyToMessageId: response.replyToMessageId,
    repliedMessageContent: response.repliedMessageContent,
  };
};
