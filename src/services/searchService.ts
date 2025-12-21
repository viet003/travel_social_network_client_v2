import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { SearchResult, SearchSuggestionsResult } from "../types/search.types";

// Search Service - API calls for global search operations

/**
 * Global search across users and groups using fulltext search
 * @param keyword - Search keyword
 * @param page - Page number (default: 0)
 * @param size - Number of items per page (default: 5)
 * @returns Combined search results for users and groups
 */
export const apiGlobalSearch = async (
    keyword: string, 
    page: number = 0, 
    size: number = 5
): Promise<ApiResponse<SearchResult>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search',
        params: { q: keyword, page, size }
    });
    return response.data;
};

/**
 * Get search suggestions for autocomplete (limited results)
 * @param keyword - Search keyword
 * @returns Quick suggestions with limited results (3 users, 3 groups)
 */
export const apiSearchSuggestions = async (
    keyword: string
): Promise<ApiResponse<SearchSuggestionsResult>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search/suggestions',
        params: { q: keyword }
    });
    return response.data;
};
