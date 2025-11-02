import axiosConfig from "../configurations/axiosConfig";
import type { 
    UserResponse, 
    UpdateUserDto, 
    UpdateUserResponse, 
    PageableResponse,
    ApiResponse 
} from "../types/user.types";

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
 * Update authenticated user's avatar
 * @param avatarFile - Avatar image file
 * @returns Updated user profile with new avatar
 */
export const apiUpdateUserAvatar = async (avatarFile: File): Promise<ApiResponse<UserResponse>> => {
    try {
        const formData = new FormData();
        formData.append('avatarImg', avatarFile);

        const response = await axiosConfig({
            method: 'POST',
            url: '/users/me/avatar',
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
 * Update authenticated user's cover image
 * @param coverFile - Cover image file
 * @returns Updated user profile with new cover image
 */
export const apiUpdateUserCoverImage = async (coverFile: File): Promise<ApiResponse<UserResponse>> => {
    try {
        const formData = new FormData();
        formData.append('coverImg', coverFile);

        const response = await axiosConfig({
            method: 'POST',
            url: '/users/me/avatar',
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
