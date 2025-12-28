import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  apiGetUserProfile, 
  apiUpdateUserProfile, 
  apiUpdateUserAvatar 
} from '../services/userService';
import type { UserResponse, UpdateUserDto, UpdateUserResponse } from '../types/user.types';

interface UseUserProfileOptions {
  userId?: string;
  autoFetch?: boolean;
}

interface UseUserProfileReturn {
  user: UserResponse | null;
  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  updateProfile: (data: UpdateUserDto) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export const useUserProfile = (
  options: UseUserProfileOptions = {}
): UseUserProfileReturn => {
  const { userId, autoFetch = true } = options;
  
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setError(new Error('User ID is required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiGetUserProfile(userId);
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch user profile');
      setError(errorObj);
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (data: UpdateUserDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiUpdateUserProfile(data);
      if (response.data) {
        // Update local state with new data from UpdateUserResponse
        const updatedData: UpdateUserResponse = response.data;
        setUser(prev => prev ? {
          ...prev,
          userName: updatedData.userName,
          userProfile: updatedData.userProfile,
          avatarImg: updatedData.avatarImg,
          coverImg: updatedData.coverImg
        } : null);
        message.success('Cập nhật thông tin thành công');
        return true;
      }
      return false;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to update profile');
      setError(errorObj);
      message.error('Cập nhật thông tin thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (file: File): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiUpdateUserAvatar(file);
      if (response.data) {
        // Avatar update creates a post, need to refetch user to get updated avatar
        if (userId) {
          const userResponse = await apiGetUserProfile(userId);
          if (userResponse.data) {
            setUser(userResponse.data);
          }
        }
        message.success('Cập nhật ảnh đại diện thành công');
        return true;
      }
      return false;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to update avatar');
      setError(errorObj);
      message.error('Cập nhật ảnh đại diện thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (autoFetch && userId) {
      fetchUser();
    }
  }, [autoFetch, userId, fetchUser]);

  return {
    user,
    loading,
    error,
    fetchUser,
    updateProfile,
    updateAvatar,
    refreshUser,
  };
};
