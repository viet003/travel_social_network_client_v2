import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { apiToggleLikePost } from '../../../services/likeService';
import { message } from 'antd';

interface LikeButtonProps {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  likeCount: number;
  setLikeCount: (count: number) => void;
  className?: string;
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  isLiked, 
  setIsLiked, 
  likeCount, 
  setLikeCount, 
  className = '', 
  postId 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    try {
      setIsLoading(true);
      
      // Store previous state for rollback
      const previousLiked = isLiked;
      const previousCount = likeCount;
      
      // Optimistic UI update - UPDATE IMMEDIATELY
      const newLikedState = !previousLiked;
      const optimisticLikeCount = newLikedState ? previousCount + 1 : Math.max(0, previousCount - 1);
      
      // Update UI first
      setIsLiked(newLikedState);
      setLikeCount(optimisticLikeCount);
      
      // Trigger animation only when liking
      if (newLikedState) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }
      
      // Call API
      const response = await apiToggleLikePost(postId);
      
      // Verify response and sync if needed
      if (response?.data) {
        // Only update if server data is different from optimistic update
        if (response.data.liked !== undefined && response.data.liked !== newLikedState) {
          setIsLiked(response.data.liked);
        }
        if (response.data.likeCount !== undefined && response.data.likeCount !== optimisticLikeCount) {
          setLikeCount(response.data.likeCount);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert to previous state on error
      setIsLiked(!isLiked); // Revert to opposite (which is the original state)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      
      message.error('Không thể cập nhật lượt thích. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`flex items-center gap-1 cursor-pointer transition-colors ${
        isLiked ? 'text-red-500' : 'hover:text-red-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <span 
        className={`inline-block ${isAnimating ? 'animate-like-bounce' : ''}`}
        style={{
          animation: isAnimating ? 'likeAnimation 0.6s ease-in-out' : 'none'
        }}
      >
        {isLiked ? (
          <Icon icon="fluent:heart-24-filled" className="w-5 h-5" />
        ) : (
          <Icon icon="fluent:heart-24-regular" className="w-5 h-5" />
        )}
      </span>
      {likeCount}
    </button>
  );
};

export default LikeButton;
