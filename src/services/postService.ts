import axiosConfig from "../configurations/axiosConfig";
import type { 
  PostResponse, 
  UpdatePostDto, 
  PageableResponse,
  ApiResponse 
} from "../types/post.types";

/**
 * Get posts by user ID
 * Endpoint: GET /post/{userId}
 * Description: Retrieve posts created by a specific user. 
 * If the authenticated user matches the requested user, all posts are returned; 
 * otherwise only public posts are returned.
 * @param userId - User UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 5)
 * @returns Pageable response containing user's posts
 */
export const apiGetPostsByUser = async (
  userId: string, 
  page: number = 0,
  size: number = 5
): Promise<ApiResponse<PageableResponse<PostResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/post/${userId}`,
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
 * Get all public posts
 * Endpoint: GET /post
 * Description: Retrieve all public posts with pagination.
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 5)
 * @returns Pageable response containing public posts
 */
export const apiGetPublicPosts = async (
  page: number = 0,
  size: number = 5
): Promise<ApiResponse<PageableResponse<PostResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/post',
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
 * Get posts by group ID
 * Endpoint: GET /post/group/{groupId}
 * Description: Retrieve all posts within a specific group.
 * @param groupId - Group UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 5)
 * @param sort - Sort order: "new_post" | "new_activity" | "relevant" (default: "new_post")
 * @returns Pageable response containing group posts
 */
export const apiGetPostsByGroup = async (
  groupId: string, 
  page: number = 0,
  size: number = 5,
  sort: string = "new_post"
): Promise<ApiResponse<PageableResponse<PostResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/post/group/${groupId}`,
      params: { page, size, sort }
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
 * Create post on user profile
 * Endpoint: POST /post/me
 * Content-Type: multipart/form-data
 * Description: Create a new post on the authenticated user's own profile. 
 * Supports text and media (multipart/form-data).
 * @param postData - Post content and privacy settings with optional media files
 * @returns Created post response
 */
export const apiCreatePost = async (
  postData: UpdatePostDto
): Promise<ApiResponse<PostResponse>> => {
  try {
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('privacy', postData.privacy);
    
    if (postData.postType) {
      formData.append('postType', postData.postType);
    }
    
    if (postData.location) {
      formData.append('location', postData.location);
    }
    
    // Add tags if present
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag) => {
        formData.append('tags', tag);
      });
    }
    
    // Backend expects 'media' not 'mediaFiles'
    if (postData.mediaFiles && postData.mediaFiles.length > 0) {
      postData.mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });
    }

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
 * Create post in group
 * Endpoint: POST /post/group/{groupId}
 * Content-Type: multipart/form-data
 * Description: Create a new post inside a group. 
 * Supports text and media (multipart/form-data).
 * @param groupId - Group UUID
 * @param postData - Post content and privacy settings with optional media files
 * @returns Created post response
 */
export const apiCreatePostInGroup = async (
  groupId: string,
  postData: UpdatePostDto
): Promise<ApiResponse<PostResponse>> => {
  try {
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('privacy', postData.privacy);
    
    if (postData.postType) {
      formData.append('postType', postData.postType);
    }
    
    if (postData.location) {
      formData.append('location', postData.location);
    }
    
    // Add tags if present
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag: string) => {
        formData.append('tags', tag);
      });
    }
    
    // Backend expects 'media' not 'mediaFiles'
    if (postData.mediaFiles && postData.mediaFiles.length > 0) {
      postData.mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });
    }

    const response = await axiosConfig({
      method: 'POST',
      url: `/post/group/${groupId}`,
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
 * Delete a post
 * Endpoint: DELETE /post/{postId}
 * Description: Delete a post by its ID. 
 * Only the owner of the post or admins can perform this action.
 * @param postId - Post UUID
 * @returns Success response
 */
export const apiDeletePost = async (postId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/post/${postId}`
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
 * Update post privacy
 * Endpoint: PATCH /post/{postId}/privacy
 * Description: Update the privacy setting (PUBLIC, FRIENDS_ONLY, PRIVATE) of a specific post.
 * @param postId - Post UUID
 * @param privacy - New privacy setting (PUBLIC | FRIENDS_ONLY | PRIVATE)
 * @returns Updated post response
 */
export const apiUpdatePostPrivacy = async (
  postId: string,
  privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
): Promise<ApiResponse<PostResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: `/post/${postId}/privacy`,
      params: { privacy }
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
 * Search posts in group
 * Endpoint: GET /post/group/{groupId}/search
 * Description: Search posts inside a group by keyword with pagination.
 * @param groupId - Group UUID
 * @param keyword - Search keyword (default: empty string)
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing search results
 */
export const apiSearchPostsInGroup = async (
  groupId: string,
  keyword: string = '',
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<PostResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/post/group/${groupId}/search`,
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
 * Share a post
 * Endpoint: POST /post/{postId}/share
 * Description: Share an existing post to your timeline with optional additional content and privacy settings.
 * @param postId - Post UUID to share
 * @param shareData - Share content and privacy settings
 * @returns Created shared post response
 */
export const apiSharePost = async (
  postId: string,
  shareData: {
    content?: string;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  }
): Promise<ApiResponse<PostResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/post/${postId}/share`,
      params: {
        content: shareData.content || '',
        privacy: shareData.privacy
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

// Legacy exports for backward compatibility (deprecated - use named exports above)
export const apiGetAllPostByGroup = apiGetPostsByGroup;
export const apiGetAllPostByUser = apiGetPostsByUser;
export const apiGetAllPostByStatus = apiGetPublicPosts;
export const apiCreatePostByUserService = apiCreatePost;
export const apiCreatePostByUserOnGroupService = apiCreatePostInGroup;
