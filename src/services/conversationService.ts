import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse, PageableResponse } from "../types/common.types";
import type { ConversationResponse, UserSummary } from "../types/conversation.types";

// Conversation Service - API calls for conversation operations

/**
 * Lấy danh sách conversations của user hiện tại
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 20)
 * @param type - Filter by conversation type: 'PRIVATE' or 'GROUP' (optional)
 * @returns Pageable response containing user's conversations
 */
export const apiGetUserConversations = async (
    page: number = 0,
    size: number = 20,
    type?: 'PRIVATE' | 'GROUP'
): Promise<ApiResponse<PageableResponse<ConversationResponse>>> => {
    try {
        const params: any = { page, size };
        if (type) {
            params.type = type;
        }
        const response = await axiosConfig({
            method: 'GET',
            url: '/conversations/my',
            params
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Lấy conversation theo ID
 * @param conversationId - Conversation UUID
 * @returns Conversation details
 */
export const apiGetConversationById = async (
    conversationId: string
): Promise<ApiResponse<ConversationResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/conversations/${conversationId}`
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Tạo hoặc lấy conversation private với một user
 * @param friendUserId - User ID to create/get conversation with
 * @returns Private conversation
 */
export const apiCreateOrGetPrivateConversation = async (
    friendUserId: string
): Promise<ApiResponse<ConversationResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'POST',
            url: `/conversations/private/${friendUserId}`
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Tạo group conversation
 * @param groupName - Name of the group
 * @param memberIds - Array of user IDs to add to group
 * @returns Created group conversation
 */
export const apiCreateGroupConversation = async (
    groupName: string,
    memberIds: string[]
): Promise<ApiResponse<ConversationResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'POST',
            url: '/conversations',
            data: { groupName, memberIds }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Tìm kiếm conversations
 * @param keyword - Search keyword
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 20)
 * @returns Pageable response containing search results
 */
export const apiSearchConversations = async (
    keyword: string,
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<PageableResponse<ConversationResponse>>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: '/conversations/search',
            params: { keyword, page, size }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Get conversation members
 * @param conversationId - Conversation UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 50)
 * @returns Pageable response containing members
 */
export const apiGetConversationMembers = async (
    conversationId: string,
    page: number = 0,
    size: number = 50
): Promise<ApiResponse<PageableResponse<any>>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/conversations/${conversationId}/members`,
            params: { page, size }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};
/**
 * Update group conversation avatar
 * @param conversationId - Conversation UUID
 * @param avatarFile - Avatar image file
 * @returns Updated conversation response
 */
export const apiUpdateGroupAvatar = async (
    conversationId: string,
    avatarFile: File
): Promise<ApiResponse<ConversationResponse>> => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        const response = await axiosConfig({
            method: 'PUT',
            url: `/conversations/${conversationId}/avatar`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};
/**
 * Get conversation media (images/videos)
 * @param conversationId - Conversation UUID
 * @returns List of media items
 */
export const apiGetConversationMedia = async (
    conversationId: string
): Promise<ApiResponse<any[]>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/conversations/${conversationId}/media`
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};
/**
 * Add members to group conversation
 * @param conversationId - Conversation UUID
 * @param userIds - Array of user IDs to add
 * @returns Success response
 */
export const apiAddMembersToConversation = async (
    conversationId: string,
    userIds: string[]
): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosConfig({
            method: 'POST',
            url: `/conversations/${conversationId}/members`,
            data: { userIds }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Remove members from group conversation (admin only)
 * @param conversationId - Conversation UUID
 * @param userIds - Array of user IDs to remove
 * @returns Success response
 */
export const apiRemoveMembersFromConversation = async (
    conversationId: string,
    userIds: string[]
): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosConfig({
            method: 'DELETE',
            url: `/conversations/${conversationId}/members`,
            data: { userIds }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Update group conversation name
 * @param conversationId - Conversation UUID
 * @param groupName - New group name
 * @returns Updated conversation response
 */
export const apiUpdateGroupName = async (
    conversationId: string,
    groupName: string
): Promise<ApiResponse<ConversationResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'PUT',
            url: `/conversations/${conversationId}/name`,
            data: { groupName }
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};

/**
 * Delete conversation (admin only for groups)
 * @param conversationId - Conversation UUID
 * @returns Success response
 */
export const apiDeleteConversation = async (
    conversationId: string
): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosConfig({
            method: 'DELETE',
            url: `/conversations/${conversationId}`
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};