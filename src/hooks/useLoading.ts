import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  toggleLoading: () => void;
}

export const useLoading = (initialState: boolean = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  return {
    isLoading,
    showLoading,
    hideLoading,
    toggleLoading
  };
};
