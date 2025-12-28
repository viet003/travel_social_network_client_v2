import axiosConfig from "../configurations/axiosConfig";
import type { 
  FriendshipResponse, 
  FriendShipRequestDto,
  UserResponse,
  UserFriendshipListsResponse,
  PageableResponse,
  ApiResponse 
} from "../types/friendship.types";

// Friendship Service - API calls for friendship operations

/**
 * Get friend suggestions
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing friend suggestions
 */
export const apiGetFriendSuggestions = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<FriendshipResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/friendship/suggestions',
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
 * Get friends of friends suggestions
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 20)
 * @returns Pageable response containing friends of friends suggestions
 */
export const apiGetFriendsOfFriendsSuggestions = async (
  page: number = 0,
  size: number = 20
): Promise<ApiResponse<PageableResponse<FriendshipResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/friendship/suggestions/friends-of-friends',
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
 * Send friend request
 * @param receiverId - User ID to send friend request to
 * @returns Success response
 */
export const apiSendFriendRequest = async (
  receiverId: string
): Promise<ApiResponse<string>> => {
  try {
    const requestData: FriendShipRequestDto = { receiverId };
    const response = await axiosConfig({
      method: 'POST',
      url: '/friendship/request',
      data: requestData
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
 * Accept friend request
 * @param friendshipId - Friendship UUID
 * @returns Success response
 */
export const apiAcceptFriendRequest = async (
  friendshipId: string
): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/friendship/${friendshipId}/accept`
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
 * Reject friend request
 * @param friendshipId - Friendship UUID
 * @returns Success response
 */
export const apiRejectFriendRequest = async (
  friendshipId: string
): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/friendship/${friendshipId}/reject`
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
 * Get my friends list
 * @returns List of friends
 */
export const apiGetMyFriends = async (): Promise<ApiResponse<UserResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/friendship/friends'
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
 * Unfriend a user
 * @param friendId - User ID to unfriend
 * @returns Success response
 */
export const apiUnfriend = async (friendId: string): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/friendship/unfriend/${friendId}`
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
 * Get pending friend requests
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing pending requests
 */
export const apiGetPendingFriendRequests = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<FriendshipResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/friendship/requests/pending',
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
 * Get user friendship lists (pending requests, friends, blocked users)
 * @param userId - User ID to get friendship lists for
 * @returns Response containing all friendship lists
 */
export const apiGetUserFriendshipLists = async (
  userId: string
): Promise<ApiResponse<UserFriendshipListsResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/friendship/users/${userId}/lists`
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
 * Get friends birthdays
 * @returns List of friends with birthdays sorted by date
 */
export const apiGetFriendsBirthdays = async (): Promise<ApiResponse<UserResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/friendship/birthdays'
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
 * Block a user
 * @param userId - User ID to block
 * @returns Response with updated friendship status
 */
export const apiBlockUser = async (userId: string): Promise<ApiResponse<{ friendshipStatus: 'BLOCKED' | null }>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/friendship/block/${userId}`
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
 * Unblock a user
 * @param userId - User ID to unblock
 * @returns Success response with null friendship status
 */
export const apiUnblockUser = async (userId: string): Promise<ApiResponse<{ friendshipStatus: null }>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/friendship/unblock/${userId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
