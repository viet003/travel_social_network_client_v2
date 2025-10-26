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

export const apiGetAllCommentsByPost = async (postId: string, page: number): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `comment/${postId}?page=${page}`,
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
      url: `comment/${commentId}/replies?page=${page}`,
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
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};
