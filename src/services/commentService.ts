import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
  data: T;
  status: string;
  [key: string]: any;
}

interface CreateCommentPayload {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export const apiGetAllCommentsByPost = async (
  postId: string, 
  page: number, 
  sort?: 'newest' | 'oldest' | 'most_relevant'
): Promise<ApiResponse> => {
  try {
    let url = `comment/${postId}?page=${page}`;
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

export const apiGetRepliesByComment = async (commentId: string, page: number): Promise<ApiResponse> => {
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

export const apiCreateCommentService = async (payload: CreateCommentPayload): Promise<ApiResponse> => {
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

export const apiToggleLikeComment = async (commentId: string): Promise<ApiResponse> => {
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

export const apiUpdateComment = async (commentId: string, content: string): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: `comment/${commentId}`,
      data: { content }, // Gửi trong body, không phải params
    });
    return response?.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw error;
  }
};

export const apiDeleteComment = async (commentId: string): Promise<ApiResponse> => {
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
