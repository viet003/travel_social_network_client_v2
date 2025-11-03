import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/post.types";

/**
 * Like/Unlike response type matching backend LikePostResponse
 */
export interface LikePostResponse {
  postId: string;
  likeCount: number;
  isLiked: boolean; // Use isLiked to match backend field name
}

/**
 * Toggle like status for a post
 * Endpoint: PUT /like/{postId}
 * Description: Toggle like status for a specific post by its ID.
 * If the post is already liked by the authenticated user, this request will remove the like;
 * otherwise, it will add a new like.
 * @param postId - Post UUID
 * @returns Like response with updated count and status
 */
export const apiToggleLikePost = async (
  postId: string
): Promise<ApiResponse<LikePostResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/like/${postId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

// Legacy export for backward compatibility (deprecated)
export const apiUpdateLikeOnPostService = apiToggleLikePost;
