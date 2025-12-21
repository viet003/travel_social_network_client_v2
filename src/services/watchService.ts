import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse, PageableResponse } from "../types/common.types";
import type { 
  WatchResponse,
  WatchWithIdsResponse,
  CreateWatchDto,
  UpdateWatchDto
} from "../types/watch.types";

/**
 * Create a new watch video
 * Endpoint: POST /watches
 * Content-Type: multipart/form-data
 */
export const apiCreateWatch = async (
  watchData: CreateWatchDto
): Promise<ApiResponse<WatchResponse>> => {
  try {
    const formData = new FormData();
    
    // Video file (required)
    formData.append('video', watchData.video);
    
    // Title (required)
    formData.append('title', watchData.title);
    
    // Privacy (required)
    formData.append('privacy', watchData.privacy);
    
    // Duration (required)
    formData.append('duration', watchData.duration.toString());
    
    // Optional fields
    if (watchData.description) {
      formData.append('description', watchData.description);
    }
    
    if (watchData.thumbnail) {
      formData.append('thumbnail', watchData.thumbnail);
    }
    
    if (watchData.location) {
      formData.append('location', watchData.location);
    }
    
    if (watchData.category) {
      formData.append('category', watchData.category);
    }
    
    // Tags as JSON string
    if (watchData.tags && watchData.tags.length > 0) {
      formData.append('tags', JSON.stringify(watchData.tags));
    }

    const response = await axiosConfig({
      method: 'POST',
      url: '/watches',
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
 * Get all public watches
 * Endpoint: GET /watches
 */
export const apiGetAllWatches = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<ApiResponse<PageableResponse<WatchResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches',
      params: { page, size, sortBy, sortDirection }
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
 * Get watches by user ID
 * Endpoint: GET /watches/user/{userId}
 */
export const apiGetWatchesByUser = async (
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<WatchResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/watches/user/${userId}`,
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
 * Get watch by ID
 * Endpoint: GET /watches/{watchId}
 */
export const apiGetWatchById = async (
  watchId: string
): Promise<ApiResponse<WatchResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/watches/${watchId}`
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
 * Update watch (cannot update video file itself)
 * Endpoint: PUT /watches/{watchId}
 * Content-Type: multipart/form-data
 */
export const apiUpdateWatch = async (
  updateData: UpdateWatchDto
): Promise<ApiResponse<WatchResponse>> => {
  try {
    const { watchId, ...data } = updateData;
    const formData = new FormData();
    
    // Optional fields to update
    if (data.title) {
      formData.append('title', data.title);
    }
    
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    if (data.location !== undefined) {
      formData.append('location', data.location);
    }
    
    if (data.privacy) {
      formData.append('privacy', data.privacy);
    }
    
    if (data.category) {
      formData.append('category', data.category);
    }
    
    // Tags as JSON string
    if (data.tags !== undefined) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    const response = await axiosConfig({
      method: 'PUT',
      url: `/watches/${watchId}`,
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
 * Delete watch
 * Endpoint: DELETE /watches/{watchId}
 */
export const apiDeleteWatch = async (
  watchId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/watches/${watchId}`
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
 * Get my watches
 * Endpoint: GET /watches/me
 */
export const apiGetMyWatches = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<WatchResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches/me',
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
 * Get my watch statistics
 * Endpoint: GET /watches/me/statistics
 */
export interface WatchStatistics {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
}

export const apiGetMyWatchStatistics = async (): Promise<ApiResponse<WatchStatistics>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches/me/statistics'
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
 * Get trending watches
 * Endpoint: GET /watches/trending
 */
export const apiGetTrendingWatches = async (
  page: number = 0,
  size: number = 10,
  days: number = 7
): Promise<ApiResponse<PageableResponse<WatchResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches/trending',
      params: { page, size, days }
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
 * Save a watch
 * Endpoint: POST /watches/saved/{watchId}
 */
export const apiSaveWatch = async (
  watchId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/watches/saved/${watchId}`
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
 * Unsave a watch
 * Endpoint: DELETE /watches/saved/{watchId}
 */
export const apiUnsaveWatch = async (
  watchId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/watches/saved/${watchId}`
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
 * Get saved watches
 * Endpoint: GET /watches/saved
 */
export const apiGetSavedWatches = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<WatchResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches/saved',
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
 * Check if watch is saved
 * Endpoint: GET /watches/saved/{watchId}/check
 */
export const apiCheckWatchSaved = async (
  watchId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/watches/saved/${watchId}/check`
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
 * Add watch to history
 * Endpoint: POST /watches/history/{watchId}
 */
export const apiAddToHistory = async (
  watchId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `/watches/history/${watchId}`
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
 * Get watch history
 * Endpoint: GET /watches/history
 */
export const apiGetWatchHistory = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<WatchWithIdsResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/watches/history',
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
 * Remove watch from history
 * Endpoint: DELETE /watches/history/{watchHistoryId}
 */
export const apiRemoveFromHistory = async (
  watchHistoryId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/watches/history/${watchHistoryId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
