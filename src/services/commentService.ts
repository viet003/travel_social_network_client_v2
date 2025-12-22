import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse, PageableResponse } from "../types/common.types";
import type { CreateCommentPayload, CommentResponse } from "../types/comment.types";

// ========== NEW APIs WITH MEANINGFUL NAMES ==========

export const apiGetCommentsByPostId = async (
  postId: string, 
  page: number, 
  sort?: 'newest' | 'oldest' | 'most_relevant'
): Promise<ApiResponse<PageableResponse<CommentResponse>>> => {
  try {
    let url = `comment/post/${postId}?page=${page}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    const response = await axiosConfig({
      method: 'GET',
      url,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiGetCommentsByWatchId = async (
  watchId: string, 
  page: number, 
  sort?: 'newest' | 'oldest' | 'most_relevant'
): Promise<ApiResponse<PageableResponse<CommentResponse>>> => {
  try {
    let url = `comment/watch/${watchId}?page=${page}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    const response = await axiosConfig({
      method: 'GET',
      url,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiGetRepliesByCommentId = async (commentId: string, page: number): Promise<ApiResponse<PageableResponse<CommentResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `comment/replies/${commentId}?page=${page}`,
    });
    return response?.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiCreateCommentForContent = async (payload: CreateCommentPayload): Promise<ApiResponse<CommentResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      data: payload,
      url: "comment",
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiUpdateCommentContent = async (commentId: string, content: string): Promise<ApiResponse<CommentResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: `comment/${commentId}`,
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

export const apiDeleteCommentById = async (commentId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `comment/${commentId}`,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiToggleLikeOnComment = async (commentId: string): Promise<ApiResponse<CommentResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `comment/like/${commentId}`,
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};
