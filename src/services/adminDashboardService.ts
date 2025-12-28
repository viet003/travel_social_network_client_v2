import axiosConfig from "../configurations/axiosConfig";
import type { ApiResponse } from "../types/common.types";
import type { AxiosResponse } from "axios";
import type { 
  DashboardStats, 
  TrafficData, 
  RecentUser, 
  RecentActivity 
} from "../types/adminDashboard.types";

/**
 * Get dashboard statistics
 */
export const apiGetDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await axiosConfig({
      method: 'GET',
      url: '/admin/dashboard/stats',
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Get traffic data for the specified number of days
 */
export const apiGetTrafficData = async (days: number = 7): Promise<TrafficData[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TrafficData[]>> = await axiosConfig({
      method: 'GET',
      url: '/admin/dashboard/traffic',
      params: { days }
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Get recent users
 */
export const apiGetRecentUsers = async (limit: number = 5): Promise<RecentUser[]> => {
  try {
    const response: AxiosResponse<ApiResponse<RecentUser[]>> = await axiosConfig({
      method: 'GET',
      url: '/admin/dashboard/recent-users',
      params: { limit }
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Get recent activities
 */
export const apiGetRecentActivities = async (limit: number = 10): Promise<RecentActivity[]> => {
  try {
    const response: AxiosResponse<ApiResponse<RecentActivity[]>> = await axiosConfig({
      method: 'GET',
      url: '/admin/dashboard/recent-activities',
      params: { limit }
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Update user status (lock/unlock)
 */
export const apiUpdateUserStatus = async (userId: string, status: 'ACTIVE' | 'INACTIVE' | 'BANNED'): Promise<RecentUser> => {
  try {
    const response: AxiosResponse<ApiResponse<RecentUser>> = await axiosConfig({
      method: 'PATCH',
      url: `/admin/users/${userId}/status`,
      data: { status }
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Delete user
 */
export const apiDeleteUser = async (userId: string): Promise<void> => {
  try {
    await axiosConfig({
      method: 'DELETE',
      url: `/admin/users/${userId}`,
    });
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Update user information
 */
export interface AdminUpdateUserData {
  email?: string;
  userName?: string;
  fullName?: string;
  location?: string;
  about?: string;
}

export const apiAdminUpdateUser = async (userId: string, data: AdminUpdateUserData): Promise<RecentUser> => {
  try {
    const response: AxiosResponse<ApiResponse<RecentUser>> = await axiosConfig({
      method: 'PUT',
      url: `/admin/users/${userId}`,
      data
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};

/**
 * Create new user (Admin only)
 */
export interface AdminCreateUserData {
  email: string;
  userName: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

export interface RegisterResponse {
  userId: string;
  email: string;
  userName: string;
  role: string;
}

export const apiAdminCreateUser = async (data: AdminCreateUserData): Promise<RegisterResponse> => {
  try {
    const response: AxiosResponse<ApiResponse<RegisterResponse>> = await axiosConfig({
      method: 'POST',
      url: '/admin/users/account',
      data
    });
    return response.data.data;
  } catch (error: unknown) {
    throw error && typeof error === 'object' && 'response' in error 
      ? (error as { response: { data: unknown } }).response.data 
      : error;
  }
};
