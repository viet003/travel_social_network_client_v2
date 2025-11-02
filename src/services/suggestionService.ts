import axiosConfig from "../configurations/axiosConfig";
import type { 
  PostResponse,
  ApiResponse 
} from "../types/post.types";

/**
 * Get personalized news feed
 * Endpoint: GET /search/newsfeed
 * Description: Get personalized news feed based on user's search history and preferences with Redis caching
 * @param page - Page number (default: 1, 1-based pagination)
 * @param pageSize - Page size (default: 20)
 * @returns Array of post responses
 */
export const apiGetNewsFeed = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PostResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/search/newsfeed',
      params: { page, pageSize }
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
 * Get search suggestions
 * Endpoint: GET /search/suggestions
 * Description: Search for users, groups, and posts based on keyword with pagination support
 * @param keyword - Search keyword
 * @param page - Page number (default: 0, 0-based pagination)
 * @param pageSize - Page size (default: 10)
 * @returns Search suggestion response containing users, groups, and posts
 */
export const apiGetSearchSuggestions = async (
  keyword: string,
  page: number = 0,
  pageSize: number = 10
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/search/suggestions',
      params: { q: keyword, page, pageSize }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
