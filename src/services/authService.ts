import axiosConfig from "../configurations/axiosConfig";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types/auth.types";
import type { ApiResponse } from "../types/common.types";

export const apiLoginService = async (payload: LoginPayload): Promise<unknown> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/local/login',
            data: payload
        });
        return response.data;
    } catch (error: unknown) {
        throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
    }
};

export const apiSignupService = async (payload: RegisterPayload): Promise<unknown> => {
    try {
        const response: ApiResponse = await axiosConfig({
            method: 'POST',
            url: '/auth/local/register',
            data: payload
        });
        return response.data;
    } catch (error: unknown) {
        throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
    }
};

export const apiForgotPassWordService = async (email: string): Promise<unknown> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/local/forgot-password',
      params: { email }   
    });
    return response.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
  }
};

export const apiResetPasswordService = async (token: string, payload: ResetPasswordPayload): Promise<unknown> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/local/reset-password',
      params: { token },
      data: payload
    });
    return response.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
  }
};

// Google OAuth Service - chỉ chứa API calls

export const apiGoogleLoginService = async (accessToken: string): Promise<unknown> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/google/login',
      data: { accessToken }
    });
    return response.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
  }
};

export const apiFacebookLoginService = async (accessToken: string): Promise<unknown> => {
  try {
    const response: ApiResponse = await axiosConfig({
      method: 'POST',
      url: '/auth/facebook/login',
      data: { accessToken }
    });
    return response.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response.data : error;
  }
};
