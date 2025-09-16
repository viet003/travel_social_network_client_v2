import axiosConfig from "../configurations/axiosConfig";
import { GOOGLE_CONFIG } from "../configurations/googleConfig";

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    userName: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
}

interface ResetPasswordPayload {
    newPassword: string;
    newPasswordConfirm: string;
}

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

export const apiLoginService = async (payload: LoginPayload): Promise<any> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/local/login',
            data: payload
        });
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error;
    }
};

export const apiSignupService = async (payload: RegisterPayload): Promise<any> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/local/register',
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
      url: '/auth/local/forgot-password',
      params: { email }   
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

export const apiResetPasswordService = async (token: string, payload: ResetPasswordPayload): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/local/reset-password',
      params: { token },
      data: payload
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};

// Google OAuth Service - chỉ chứa API calls

export const apiGoogleLoginService = async (accessToken: string): Promise<any> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/google/login',
      data: { accessToken }
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};