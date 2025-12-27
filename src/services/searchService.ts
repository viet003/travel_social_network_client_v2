import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { SearchResult, SearchSuggestionsResult } from "../types/search.types";

// Search Service - API calls for global search operations

/**
 * Global search across users and groups using fulltext search
 * @param keyword - Search keyword
 * @param limit - Number of items per category (default: 5)
 * @returns Combined search results for users, groups, and posts
 */
export const apiGlobalSearch = async (
    keyword: string, 
    limit: number = 5
): Promise<ApiResponse<SearchResult>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search',
        params: { q: keyword, limit }
    });
    return response.data;
};

/**
 * Search users only with pagination
 * @param keyword - Search keyword
 * @param page - Page number
 * @param size - Number of items per page
 * @returns Paginated user search results
 */
export const apiSearchUsers = async (
    keyword: string,
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<any>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search/users',
        params: { q: keyword, page, size }
    });
    return response.data;
};

/**
 * Search groups only with pagination
 * @param keyword - Search keyword
 * @param page - Page number
 * @param size - Number of items per page
 * @returns Paginated group search results
 */
export const apiSearchGroups = async (
    keyword: string,
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<any>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search/groups',
        params: { q: keyword, page, size }
    });
    return response.data;
};

/**
 * Search posts only with pagination
 * @param keyword - Search keyword
 * @param page - Page number
 * @param size - Number of items per page
 * @returns Paginated post search results
 */
export const apiSearchPosts = async (
    keyword: string,
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<any>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search/posts',
        params: { q: keyword, page, size }
    });
    return response.data;
};

/**
 * Search blogs only with pagination
 * @param keyword - Search keyword
 * @param page - Page number
 * @param size - Number of items per page
 * @returns Paginated blog search results
 */
export const apiSearchBlogs = async (
    keyword: string,
    page: number = 0,
    size: number = 10
): Promise<ApiResponse<any>> => {
    const response = await axiosConfig({
        method: 'GET',
        url: '/search/blogs',
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
