import axiosConfig from "../configurations/axiosConfig";
import type { 
  VideoResponse,
  CreateVideoDto,
  UpdateVideoDto,
  PageableResponse,
  ApiResponse,
  VideoStatisticsResponse
} from "../types/video.types";

/**
 * Get video feed (public videos for discovery)
 * Endpoint: GET /videos/feed
 * Description: Get personalized video feed similar to Reels/TikTok
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing videos
 */
export const apiGetVideoFeed = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<VideoResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/videos/feed',
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
 * Get featured/trending videos
 * Endpoint: GET /videos/featured
 * Description: Get featured or trending videos
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing featured videos
 */
export const apiGetFeaturedVideos = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<VideoResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/videos/featured',
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
 * Get video by ID
 * Endpoint: GET /videos/{videoId}
 * Description: Retrieve a single video by its ID
 * @param videoId - Video UUID
 * @returns Video response
 */
export const apiGetVideoById = async (videoId: string): Promise<ApiResponse<VideoResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/videos/${videoId}`
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
 * Get videos by user ID
 * Endpoint: GET /videos/user/{userId}
 * Description: Get all videos created by a specific user
 * @param userId - User UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing user's videos
 */
export const apiGetVideosByUser = async (
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<VideoResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/videos/user/${userId}`,
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
 * Create a new video
 * Endpoint: POST /videos
 * Content-Type: multipart/form-data
 * Description: Upload and create a new video (Reels style)
 * @param videoData - Video data including file
 * @returns Created video response
 */
export const apiCreateVideo = async (
  videoData: CreateVideoDto
): Promise<ApiResponse<VideoResponse>> => {
  try {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('privacy', videoData.privacy);
    
    if (videoData.description) {
      formData.append('description', videoData.description);
    }
    
    if (videoData.location) {
      formData.append('location', videoData.location);
    }
    
    // Add tags if present
    if (videoData.tags && videoData.tags.length > 0) {
      videoData.tags.forEach((tag) => {
        formData.append('tags', tag);
      });
    }
    
    // Add video file
    formData.append('videoFile', videoData.videoFile);

    const response = await axiosConfig({
      method: 'POST',
      url: '/videos',
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
 * Update video information
 * Endpoint: PUT /videos/{videoId}
 * Description: Update video metadata (not the video file itself)
 * @param videoId - Video UUID
 * @param videoData - Updated video data
 * @returns Updated video response
 */
export const apiUpdateVideo = async (
  videoId: string,
  videoData: UpdateVideoDto
): Promise<ApiResponse<VideoResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/videos/${videoId}`,
      data: videoData
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
 * Delete a video
 * Endpoint: DELETE /videos/{videoId}
 * Description: Delete a video by its ID
 * @param videoId - Video UUID
 * @returns Success response
 */
export const apiDeleteVideo = async (videoId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/videos/${videoId}`
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
 * Record video view
 * Endpoint: POST /videos/{videoId}/view
 * Description: Track when a user views a video
 * @param videoId - Video UUID
 * @param watchDuration - Duration watched in seconds
 * @returns Success response
 */
export const apiRecordVideoView = async (
  videoId: string,
  watchDuration: number
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/videos/${videoId}/view`,
      data: { watchDuration }
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
 * Get user's video statistics
 * Endpoint: GET /videos/user/{userId}/statistics
 * Description: Get statistics for user's videos
 * @param userId - User UUID
 * @returns Video statistics response
 */
export const apiGetUserVideoStatistics = async (
  userId: string
): Promise<ApiResponse<VideoStatisticsResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/videos/user/${userId}/statistics`
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
 * Search videos by keyword
 * Endpoint: GET /videos/search
 * Description: Search videos by title, description, or tags
 * @param keyword - Search keyword
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing search results
 */
export const apiSearchVideos = async (
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<VideoResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/videos/search',
      params: { q: keyword, page, size }
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
 * Get videos by tag
 * Endpoint: GET /videos/tag/{tag}
 * Description: Get videos with a specific tag
 * @param tag - Tag name
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing tagged videos
 */
export const apiGetVideosByTag = async (
  tag: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<VideoResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/videos/tag/${tag}`,
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
 * Update video privacy
 * Endpoint: PATCH /videos/{videoId}/privacy
 * Description: Update the privacy setting of a video
 * @param videoId - Video UUID
 * @param privacy - New privacy setting
 * @returns Updated video response
 */
export const apiUpdateVideoPrivacy = async (
  videoId: string,
  privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
): Promise<ApiResponse<VideoResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: `/videos/${videoId}/privacy`,
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
