import axiosConfig from "../configurations/axiosConfig";
import type { 
  BlogResponse, 
  BlogDto, 
  BlogStatus
} from "../types/blog.types";
import type { ApiResponse, PageableResponse } from "../types/common.types";

/**
 * Get all published blogs
 * Endpoint: GET /blogs
 * Description: Retrieve a paginated list of all published blogs
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @param sort - Sort order (optional)
 * @returns Pageable response containing blogs
 */
export const apiGetAllBlogs = async (
  page: number = 0,
  size: number = 10,
  sort?: string
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs',
      params: { page, size, sort }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get blog by ID
 * Endpoint: GET /blogs/{blogId}
 * Description: Retrieve a specific blog by its ID and increment view count
 * @param blogId - Blog UUID
 * @returns Blog response
 */
export const apiGetBlogById = async (blogId: string): Promise<ApiResponse<BlogResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/blogs/${blogId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get blogs by user
 * Endpoint: GET /blogs/user/{userId}
 * Description: Retrieve all blogs created by a specific user
 * @param userId - User UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing user's blogs
 */
export const apiGetBlogsByUser = async (
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/blogs/user/${userId}`,
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get my blogs
 * Endpoint: GET /blogs/me
 * Description: Retrieve all blogs created by the authenticated user
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @param status - Filter by status (optional): DRAFT, PUBLISHED, PENDING, ARCHIVED
 * @returns Pageable response containing user's own blogs
 */
export const apiGetMyBlogs = async (
  page: number = 0,
  size: number = 10,
  status?: BlogStatus
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/me',
      params: { page, size, status }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get featured blogs
 * Endpoint: GET /blogs/featured
 * Description: Retrieve featured blogs
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing featured blogs
 */
export const apiGetFeaturedBlogs = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/featured',
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get trending blogs
 * Endpoint: GET /blogs/trending
 * Description: Retrieve trending blogs sorted by view count
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing trending blogs
 */
export const apiGetTrendingBlogs = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/trending',
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get popular blogs
 * Endpoint: GET /blogs/popular
 * Description: Retrieve popular blogs sorted by rating
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing popular blogs
 */
export const apiGetPopularBlogs = async (
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/popular',
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Search blogs
 * Endpoint: GET /blogs/search
 * Description: Search blogs by title or description
 * @param query - Search query
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing search results
 */
export const apiSearchBlogs = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/search',
      params: { query, page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Search blogs by location
 * Endpoint: GET /blogs/search/location
 * Description: Search blogs by location
 * @param location - Location to search
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing location search results
 */
export const apiSearchBlogsByLocation = async (
  location: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/blogs/search/location',
      params: { location, page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Get blogs by tag
 * Endpoint: GET /blogs/tag/{tagId}
 * Description: Retrieve blogs filtered by tag
 * @param tagId - Tag UUID
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @returns Pageable response containing blogs with the specified tag
 */
export const apiGetBlogsByTag = async (
  tagId: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PageableResponse<BlogResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/blogs/tag/${tagId}`,
      params: { page, size }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Create a new blog with FormData (supports file upload)
 * Endpoint: POST /blogs
 * Content-Type: multipart/form-data
 * Description: Create a new travel blog with file uploads
 * @param formData - FormData containing blog data and files
 * @returns Created blog response
 */
export const apiCreateBlogWithFormData = async (
  formData: FormData
): Promise<ApiResponse<BlogResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: '/blogs',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Create a new blog
 * Endpoint: POST /blogs
 * Content-Type: application/json
 * Description: Create a new travel blog
 * @param blogDto - Blog data transfer object
 * @returns Created blog response
 */
export const apiCreateBlog = async (
  blogDto: BlogDto
): Promise<ApiResponse<BlogResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: '/blogs',
      data: blogDto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Update blog with FormData (supports file upload)
 * Endpoint: PUT /blogs/{blogId}
 * Content-Type: multipart/form-data
 * Description: Update an existing blog with file uploads
 * @param blogId - Blog UUID
 * @param formData - FormData containing blog data and files
 * @returns Updated blog response
 */
export const apiUpdateBlogWithFormData = async (
  blogId: string,
  formData: FormData
): Promise<ApiResponse<BlogResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/blogs/${blogId}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Update blog
 * Endpoint: PUT /blogs/{blogId}
 * Content-Type: application/json
 * Description: Update an existing blog
 * @param blogId - Blog UUID
 * @param blogDto - Blog data transfer object
 * @returns Updated blog response
 */
export const apiUpdateBlog = async (
  blogId: string,
  blogDto: BlogDto
): Promise<ApiResponse<BlogResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/blogs/${blogId}`,
      data: blogDto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};

/**
 * Delete blog
 * Endpoint: DELETE /blogs/{blogId}
 * Description: Delete a blog
 * @param blogId - Blog UUID
 * @returns Success response
 */
export const apiDeleteBlog = async (blogId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/blogs/${blogId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw (error as { data: unknown }).data;
    }
    throw error;
  }
};
