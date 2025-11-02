import { useState, useCallback } from 'react';
import { message } from 'antd';
import { apiSearchUsersByKeyword } from '../services/userService';
import type { UserResponse, PageableResponse } from '../types/user.types';

interface UseUserSearchOptions {
  pageSize?: number;
}

interface UseUserSearchReturn {
  users: UserResponse[];
  loading: boolean;
  error: Error | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  searchUsers: (keyword: string, page?: number) => Promise<void>;
  clearSearch: () => void;
  loadMore: () => Promise<void>;
}

export const useUserSearch = (
  options: UseUserSearchOptions = {}
): UseUserSearchReturn => {
  const { pageSize = 10 } = options;
  
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const clearSearch = useCallback(() => {
    setUsers([]);
    setCurrentKeyword('');
    setCurrentPage(0);
    setTotalElements(0);
    setTotalPages(0);
    setHasMore(false);
    setError(null);
  }, []);

  const searchUsers = useCallback(async (keyword: string, page: number = 0) => {
    if (!keyword.trim()) {
      clearSearch();
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentKeyword(keyword);

    try {
      const response = await apiSearchUsersByKeyword(keyword, page, pageSize);
      if (response.data) {
        const pageData: PageableResponse<UserResponse> = response.data;
        
        if (page === 0) {
          setUsers(pageData.content);
        } else {
          setUsers(prev => [...prev, ...pageData.content]);
        }
        
        setCurrentPage(pageData.pageNumber);
        setTotalElements(pageData.totalElements);
        setTotalPages(pageData.totalPages);
        setHasMore(!pageData.last);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to search users');
      setError(errorObj);
      message.error('Không thể tìm kiếm người dùng');
    } finally {
      setLoading(false);
    }
  }, [pageSize, clearSearch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !currentKeyword) return;
    await searchUsers(currentKeyword, currentPage + 1);
  }, [hasMore, loading, currentKeyword, currentPage, searchUsers]);

  return {
    users,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    hasMore,
    searchUsers,
    clearSearch,
    loadMore,
  };
};
