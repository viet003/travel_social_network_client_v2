import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
  data: T;
  status: string;
  [key: string]: any;
}

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export const apiUpdateLikeOnPostService = async (postId: string): Promise<ApiResponse<LikeResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: `like/post/${postId}`,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};
