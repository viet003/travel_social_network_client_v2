import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { ContentLikeResponse } from "../types/like.types";

/**
 * Toggle like on post
 * Endpoint: PUT /like/post/{postId}
 * Description: Like or unlike a specific post by its ID.
 * If already liked, the like will be removed; otherwise, a new like will be added.
 * @param postId - Post UUID
 * @returns Content like response with updated count and status
 */
export const apiToggleLikeOnPost = async (
  postId: string
): Promise<ApiResponse<ContentLikeResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/like/post/${postId}`
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
 * Toggle like on watch
 * Endpoint: PUT /like/watch/{watchId}
 * Description: Like or unlike a specific watch/video by its ID.
 * If already liked, the like will be removed; otherwise, a new like will be added.
 * @param watchId - Watch UUID
 * @returns Content like response with updated count and status
 */
export const apiToggleLikeOnWatch = async (
  watchId: string
): Promise<ApiResponse<ContentLikeResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/like/watch/${watchId}`
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
 * Generic toggle like function that works for both posts and watches
 * @param contentId - Content UUID (post or watch)
 * @param contentType - Type of content ('post' or 'watch')
 * @returns Content like response with updated count and status
 */
export const apiToggleLikeOnContent = async (
  contentId: string,
  contentType: 'post' | 'watch' = 'post'
): Promise<ApiResponse<ContentLikeResponse>> => {
  if (contentType === 'watch') {
    return apiToggleLikeOnWatch(contentId);
  }
  return apiToggleLikeOnPost(contentId);
};
