import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
  data: T;
  status: string;
  [key: string]: any;
}

export const apiGetAllPostByGroup = async (groupId: string, page: number): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `post/group/${groupId}?page=${page}`,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiGetAllPostByUser = async (userId: string, page: number): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `post/${userId}?page=${page}`,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiGetAllPostByStatus = async (page: number): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `post?page=${page}`,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiCreatePostByUserService = async (payload: FormData): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      data: payload,
      url: "post",
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiCreatePostByUserOnGroupService = async (payload: FormData, groupId: string): Promise<ApiResponse> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      data: payload,
      url: `post/group/${groupId}`,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};
