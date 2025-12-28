import axiosConfig from "../configurations/axiosConfig";
import type { 
    UserResponse, 
    UpdateUserDto, 
    UpdateUserResponse, 
    PageableResponse,
    ApiResponse,
    UserPhotosResponse,
    UserVideosResponse
} from "../types/user.types";
import type { PostResponse } from "../types/post.types";

// User Service - API calls for user operations

/**
 * Search users by keyword (username, email, etc.)
 * @param keyword - Search keyword
 * @param page - Page number (default: 0)
 * @param pageSize - Number of items per page (default: 10)
 * @returns Pageable response containing user list
 */
export const apiSearchUsersByKeyword = async (
    keyword: string, 
    page: number = 0, 
    pageSize: number = 10
): Promise<ApiResponse<PageableResponse<UserResponse>>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: '/users/search',
            params: {
                q: keyword,
                page,
                pageSize
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
 * Get user profile by user ID
 * @param userId - User UUID
 * @returns User profile information
 */
export const apiGetUserProfile = async (userId: string): Promise<ApiResponse<UserResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/users/${userId}`
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
 * Update authenticated user's avatar by creating a post with postType AVATAR_UPDATE
 * @param avatarFile - Avatar image file
 * @returns Created post response with avatar
 */
export const apiUpdateUserAvatar = async (avatarFile: File): Promise<ApiResponse<PostResponse>> => {
    try {
        const formData = new FormData();
        formData.append('content', 'đã cập nhật ảnh đại diện');
        formData.append('privacy', 'PUBLIC');
        formData.append('postType', 'AVATAR_UPDATE');
        formData.append('mediaFiles', avatarFile);

        const response = await axiosConfig({
            method: 'POST',
            url: '/post/me',
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
 * Update authenticated user's cover image by creating a post with postType COVER_UPDATE
 * @param coverFile - Cover image file
 * @returns Created post response with cover image
 */
export const apiUpdateUserCoverImage = async (coverFile: File): Promise<ApiResponse<PostResponse>> => {
    try {
        const formData = new FormData();
        formData.append('content', 'đã cập nhật ảnh bìa');
        formData.append('privacy', 'PUBLIC');
        formData.append('postType', 'COVER_UPDATE');
        formData.append('mediaFiles', coverFile);

        const response = await axiosConfig({
            method: 'POST',
            url: '/post/me',
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
 * Update authenticated user's profile information
 * @param updateUserDto - Updated user data
 * @returns Updated user profile response
 */
export const apiUpdateUserProfile = async (
    updateUserDto: UpdateUserDto
): Promise<ApiResponse<UpdateUserResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'PUT',
            url: '/users/me',
            data: updateUserDto
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
 * Get user photos (avatars, covers, and post images)
 * @param userId - User UUID
 * @returns User photos response
 */
export const apiGetUserPhotos = async (userId: string): Promise<ApiResponse<UserPhotosResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/users/${userId}/photos`
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
 * Get user videos from normal posts
 * @param userId - User UUID
 * @returns User videos response
 */
export const apiGetUserVideos = async (userId: string): Promise<ApiResponse<UserVideosResponse>> => {
    try {
        const response = await axiosConfig({
            method: 'GET',
            url: `/users/${userId}/videos`
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            throw (error as { response: { data: unknown } }).response.data;
        }
        throw error;
    }
};
