import axiosConfig from "../configurations/axiosConfig";
import type { 
  PostResponse,
  ApiResponse,
  PageableResponse 
} from "../types/post.types";

/**
 * Get personalized news feed
 * Endpoint: GET /suggestions/newsfeed
 * Description: Get personalized news feed based on user's search history and preferences with Redis caching
 * @param page - Page number (default: 0, 0-based pagination)
 * @param pageSize - Page size (default: 10)
 * @returns Pageable response with posts and metadata
 */
export const apiGetNewsFeed = async (
  page: number = 0,
  pageSize: number = 10
): Promise<ApiResponse<PageableResponse<PostResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/suggestions/newsfeed',
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
 * Get AI-powered search suggestions
 * Endpoint: GET /suggestions
 * Description: Get intelligent search suggestions based on user behavior and preferences
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
      url: '/suggestions',
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
