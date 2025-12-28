import axiosConfig from "../configurations/axiosConfig";
import type {
  NotificationResponse,
  CreateNotificationDto,
  UpdateNotificationDto,
  PageableResponse,
  ApiResponse
} from "../types/notification.types";

/**
 * Get current user's notifications with pagination
 * Endpoint: GET /notifications/me
 * @param page - Page number (default: 0)
 * @param pageSize - Page size (default: 10)
 * @returns Pageable response containing notifications
 */
export const apiGetMyNotifications = async (
  page: number = 0,
  pageSize: number = 10
): Promise<ApiResponse<PageableResponse<NotificationResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/notifications/me',
      params: { page, pageSize }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Get current user's unread notifications
 * Endpoint: GET /notifications/me/unread
 * @returns List of unread notifications
 */
export const apiGetUnreadNotifications = async (): Promise<ApiResponse<NotificationResponse[]>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/notifications/me/unread'
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Get unread notifications count
 * Endpoint: GET /notifications/me/unread-count
 * @returns Unread count
 */
export const apiGetUnreadCount = async (): Promise<ApiResponse<number>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: '/notifications/me/unread-count'
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Get notifications by type
 * Endpoint: GET /notifications/me/type/{type}
 * @param type - Notification type (e.g., "NEW_POST", "POST_LIKE")
 * @param page - Page number (default: 0)
 * @param pageSize - Page size (default: 10)
 * @returns Pageable response containing notifications of specific type
 */
export const apiGetNotificationsByType = async (
  type: string,
  page: number = 0,
  pageSize: number = 10
): Promise<ApiResponse<PageableResponse<NotificationResponse>>> => {
  try {
    const response = await axiosConfig({
      method: 'GET',
      url: `/notifications/me/type/${type}`,
      params: { page, pageSize }
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Create a new notification
 * Endpoint: POST /notifications
 * @param dto - Create notification data
 * @returns Created notification
 */
export const apiCreateNotification = async (
  dto: CreateNotificationDto
): Promise<ApiResponse<NotificationResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'POST',
      url: '/notifications',
      data: dto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Mark a notification as read
 * Endpoint: PATCH /notifications/{notificationId}/read
 * @param notificationId - Notification UUID
 * @returns Updated notification
 */
export const apiMarkNotificationAsRead = async (
  notificationId: string
): Promise<ApiResponse<NotificationResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: `/notifications/${notificationId}/read`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Mark all notifications as read
 * Endpoint: PATCH /notifications/me/read-all
 * @returns Success response
 */
export const apiMarkAllNotificationsAsRead = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'PATCH',
      url: '/notifications/me/read-all'
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Update notification
 * Endpoint: PUT /notifications/{notificationId}
 * @param notificationId - Notification UUID
 * @param dto - Update notification data
 * @returns Updated notification
 */
export const apiUpdateNotification = async (
  notificationId: string,
  dto: UpdateNotificationDto
): Promise<ApiResponse<NotificationResponse>> => {
  try {
    const response = await axiosConfig({
      method: 'PUT',
      url: `/notifications/${notificationId}`,
      data: dto
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};

/**
 * Delete a notification
 * Endpoint: DELETE /notifications/{notificationId}
 * @param notificationId - Notification UUID
 * @returns Success response
 */
export const apiDeleteNotification = async (
  notificationId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosConfig({
      method: 'DELETE',
      url: `/notifications/${notificationId}`
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error;
    }
    throw error;
  }
};
