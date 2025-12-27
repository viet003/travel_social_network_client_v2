import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import webSocketService from '../services/webSocketService';
import {
  apiGetMyNotifications,
  apiGetUnreadCount,
  apiMarkNotificationAsRead,
  apiMarkAllNotificationsAsRead
} from '../services/notificationService';
import type {
  NotificationResponse
} from '../types/notification.types';
import { toast } from 'react-toastify';

interface NotificationState {
  notifications: NotificationResponse[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
}

interface UseNotificationReturn extends NotificationState {
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

export const useNotification = (): UseNotificationReturn => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    hasMore: true,
    currentPage: 0
  });

  const { token, userId } = useSelector((state: any) => ({
    token: state.auth?.token,
    userId: state.auth?.userId
  }));

  const PAGE_SIZE = 10;

  // Debug log
  useEffect(() => {
  }, [token, userId]);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async (page: number = 0) => {
    if (!token) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await apiGetMyNotifications(page, PAGE_SIZE);
      const { content, totalPages } = response.data;

      setState(prev => ({
        ...prev,
        notifications: page === 0 ? content : [...prev.notifications, ...content],
        hasMore: page < totalPages - 1,
        currentPage: page,
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Không thể tải thông báo');
    }
  }, [token]);

  /**
   * Fetch unread count
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiGetUnreadCount();
      setState(prev => ({ ...prev, unreadCount: response.data }));
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  }, [token]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      
      // Update local state
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.notificationId === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllNotificationsAsRead();
      
      // Update local state
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
      
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
      toast.error('Không thể đánh dấu tất cả là đã đọc');
    }
  }, []);

  /**
   * Load more notifications
   */
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;
    await fetchNotifications(state.currentPage + 1);
  }, [state.hasMore, state.isLoading, state.currentPage, fetchNotifications]);

  /**
   * Handle real-time notification from WebSocket
   */
  const handleWebSocketNotification = useCallback((notification: NotificationResponse) => {
    // Add to top of notifications list
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1
    }));

    // Play notification sound
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Could not play notification sound:', err));
    } catch (err) {
      console.log('Notification sound error:', err);
    }

    // Show toast notification
    toast.info(notification.content, {
      position: 'top-right',
      autoClose: 5000
    });
  }, []);

  /**
   * Register WebSocket notification handler
   * Note: Connection is established in MainLayout
   */
  useEffect(() => {
    // Register notification handler
    const unsubscribe = webSocketService.onNotification(handleWebSocketNotification);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [handleWebSocketNotification]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (token) {
      fetchNotifications(0);
      refreshUnreadCount();
    }
  }, [token, fetchNotifications, refreshUnreadCount]);

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    loadMore,
    refreshUnreadCount
  };
};

export default useNotification;
