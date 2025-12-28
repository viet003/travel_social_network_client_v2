import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse, PageableResponse } from "../types/common.types";
import type { BlogReviewResponse, CreateBlogReviewPayload } from "../types/blogReview.types";

// ========== BLOG REVIEW APIs ==========

export const apiGetReviewsByBlogId = async (
  blogId: string,
  page: number,
  sort?: 'newest' | 'oldest' | 'rating' | 'most_relevant'
): Promise<ApiResponse<PageableResponse<unknown>>> => {
  try {
    let url = `blogs/reviews/blog/${blogId}?page=${page}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    const response = await axiosConfig({
      method: 'GET',
      url,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiGetAllReviewsByBlogId = async (
  blogId: string,
  page: number
): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `blogs/reviews/blog/${blogId}/all?page=${page}`,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiCreateBlogReview = async (payload: CreateBlogReviewPayload): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      data: payload,
      url: "blogs/reviews",
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiUpdateBlogReview = async (reviewId: string, content: string): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `blogs/reviews/${reviewId}`,
      data: { content },
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiDeleteBlogReview = async (reviewId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `blogs/reviews/${reviewId}`,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiGetReviewsByUserId = async (
  userId: string,
  page: number,
  size: number = 10
): Promise<ApiResponse<PageableResponse<unknown>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `blogs/reviews/user/${userId}?page=${page}&size=${size}`,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
