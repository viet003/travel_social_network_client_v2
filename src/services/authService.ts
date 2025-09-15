import axiosConfig from "../configurations/axiosConfig";

interface AuthPayload {
    email: string;
    password: string;
    [key: string]: any; // Thêm nếu có các trường khác
}

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

export const apiLoginService = async (payload: AuthPayload): Promise<any> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/login',
            data: payload
        });
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error;
    }
};

export const apiSignupService = async (payload: AuthPayload): Promise<any> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/register',
            data: payload
        });
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error;
    }
};
export const apiForgotPassWordService = async (email: string): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/forgot-password',
      params: { email }   
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};
