import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    success: boolean;
    path: string;
    message: string;
    data: T;
    errors: any;
    timestamp: string;
}

// Server response structure - match với ConversationResponse.java từ server
export interface UserSummary {
    userId: string;
    userName: string;
    email: string;
    avatarImg: string | null;
}

export interface ConversationResponse {
    conversationId: string;
    conversationName: string | null;
    conversationAvatar: string | null;
    type: "PRIVATE" | "GROUP";
    otherUserId: string | null;
    lastMessage: string | null;
    lastActiveAt: string | null;
    
    // New fields
    groupOwner?: boolean | null;  // true nếu current user là chủ nhóm
    members?: UserSummary[];  // Tối đa 3 thành viên
    recentMedia?: string[];  // Tối đa 3 ảnh gần nhất
}

export interface PageableResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

// Conversation Service - API calls for conversation operations

/**
 * Lấy danh sách conversations của user hiện tại
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 20)
 * @returns Pageable response containing user's conversations
 */
export const apiGetUserConversations = async (
    page: number = 0,
    size: number = 20
): Promise<ApiResponse<PageableResponse<ConversationResponse>>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: '/conversations/my',
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
