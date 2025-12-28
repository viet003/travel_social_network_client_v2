import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { TagResponse } from "../types/tag.types";

/**
 * Search tags
 * Endpoint: GET /tags/search
 * Description: Search tags by title or get recent tags if query is empty
 * @param query - Search query (default: empty string for recent tags)
 * @param limit - Maximum number of results (default: 10)
 * @returns List of tags
 */
export const apiSearchTags = async (
  query: string = '',
  limit: number = 10
): Promise<ApiResponse<TagResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/tags/search',
      params: { query, limit }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
