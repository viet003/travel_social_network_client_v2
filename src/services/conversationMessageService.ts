import axiosConfig from "../configurations/axiosConfig";
import type { ChatMessage, GetMessagesParams, MessagesPageResponse } from "../types/chat.types";
import type { ApiResponse } from "../types/common.types";
import { transformMongoMessagesToChat } from "../utilities/messageTransformers";

// Conversation Message Service - MongoDB-based API calls for conversation message operations

/**
 * Get messages for a conversation with pagination (MongoDB)
 * @param params - GetMessagesParams
 * @returns Promise<MessagesPageResponse>
 */
export const apiGetConversationMessages = async (
    params: GetMessagesParams
): Promise<MessagesPageResponse> => {
    const { conversationId, page = 0, size = 50 } = params;
    
    const response = await axiosConfig.get<ApiResponse<any>>(
        `/mongo/messages/conversation/${conversationId}`,
        {
            params: { page, size }
        }
    );
    
    // Transform MongoDB documents to ChatMessage format
    const transformedContent = transformMongoMessagesToChat(response.data.data.content);
    
    return {
        content: transformedContent,
        totalElements: response.data.data.totalElements,
        totalPages: response.data.data.totalPages,
        currentPage: response.data.data.number || page,
        pageSize: response.data.data.size || size,
        hasNext: !response.data.data.last,
        hasPrevious: !response.data.data.first,
    };
};

/**
 * Search messages in a conversation
 * @param conversationId - Conversation ID
 * @param keyword - Search keyword
 * @param page - Page number
 * @param size - Page size
 * @returns Promise<MessagesPageResponse>
 */
export const apiSearchMessages = async (
    conversationId: string,
    keyword: string,
    page: number = 0,
    size: number = 20
): Promise<MessagesPageResponse> => {
    const response = await axiosConfig.get<ApiResponse<MessagesPageResponse>>(
        `/mongo/messages/conversation/${conversationId}/search`,
        {
            params: { keyword, page, size }
        }
    );
    
    return response.data.data;
};

/**
 * Get last message in a conversation
 * @param conversationId - Conversation ID
 * @returns Promise<ChatMessage | null>
 */
export const apiGetLastMessage = async (
    conversationId: string
): Promise<ChatMessage | null> => {
    const response = await axiosConfig.get<ApiResponse<ChatMessage>>(
        `/mongo/messages/conversation/${conversationId}/last`
    );
    
    return response.data.data;
};

/**
 * Update message content
 * @param messageId - Message ID (MongoDB ID)
 * @param content - New content
 * @returns Promise<ChatMessage>
 */
export const apiUpdateMessage = async (
    messageId: string,
    content: string
): Promise<ChatMessage> => {
    const response = await axiosConfig.put<ApiResponse<ChatMessage>>(
        `/mongo/messages/${messageId}`,
        null,
        {
            params: { content }
        }
    );
    
    return response.data.data;
};

/**
 * Delete message (soft delete)
 * @param messageId - Message ID (MongoDB ID)
 * @returns Promise<void>
 */
export const apiDeleteMessage = async (messageId: string): Promise<void> => {
    await axiosConfig.delete(`/mongo/messages/${messageId}`);
};

/**
 * Mark message as read
 * @param messageId - Message ID (MongoDB ID)
 * @returns Promise<void>
 */
export const apiMarkMessageAsRead = async (messageId: string): Promise<void> => {
    await axiosConfig.put(`/mongo/messages/${messageId}/read`);
};

/**
 * Count unread messages in a conversation
 * @param conversationId - Conversation ID
 * @param lastReadTimestamp - Last read timestamp (optional)
 * @returns Promise<number>
 */
export const apiCountUnreadMessages = async (
    conversationId: string,
    lastReadTimestamp?: number
): Promise<number> => {
    const response = await axiosConfig.get<ApiResponse<number>>(
        `/mongo/messages/conversation/${conversationId}/unread-count`,
        {
            params: lastReadTimestamp ? { lastReadTimestamp } : {}
        }
    );
    
    return response.data.data;
};

/**
 * Get unread messages in a conversation
 * @param conversationId - Conversation ID
 * @param lastReadTimestamp - Last read timestamp (optional)
 * @returns Promise<ChatMessage[]>
 */
export const apiGetUnreadMessages = async (
    conversationId: string,
    lastReadTimestamp?: number
): Promise<ChatMessage[]> => {
    const response = await axiosConfig.get<ApiResponse<ChatMessage[]>>(
        `/mongo/messages/conversation/${conversationId}/unread`,
        {
            params: lastReadTimestamp ? { lastReadTimestamp } : {}
        }
    );
    
    return response.data.data;
};

/**
 * Get messages by type (e.g., images, videos)
 * @param conversationId - Conversation ID
 * @param type - Message type
 * @param page - Page number
 * @param size - Page size
 * @returns Promise<MessagesPageResponse>
 */
export const apiGetMessagesByType = async (
    conversationId: string,
    type: 'text' | 'image' | 'video' | 'file',
    page: number = 0,
    size: number = 20
): Promise<MessagesPageResponse> => {
    const response = await axiosConfig.get<ApiResponse<MessagesPageResponse>>(
        `/mongo/messages/conversation/${conversationId}/type/${type}`,
        {
            params: { page, size }
        }
    );
    
    return response.data.data;
};

/**
 * Get thread messages (replies to a message)
 * @param messageId - Message ID (MongoDB ID)
 * @returns Promise<ChatMessage[]>
 */
export const apiGetThreadMessages = async (messageId: string): Promise<ChatMessage[]> => {
    const response = await axiosConfig.get<ApiResponse<ChatMessage[]>>(
        `/mongo/messages/${messageId}/thread`
    );
    
    return response.data.data;
};

/**
 * Count total messages in a conversation
 * @param conversationId - Conversation ID
 * @returns Promise<number>
 */
export const apiCountMessages = async (conversationId: string): Promise<number> => {
    const response = await axiosConfig.get<ApiResponse<number>>(
        `/mongo/messages/conversation/${conversationId}/count`
    );
    
    return response.data.data;
};
