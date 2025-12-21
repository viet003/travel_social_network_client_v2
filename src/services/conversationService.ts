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
