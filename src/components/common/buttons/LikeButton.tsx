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
      
      // Optimistic UI update
      const newLikedState = !isLiked;
      const optimisticLikeCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
      
      // Trigger animation only when liking
      if (newLikedState) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }
      
      setIsLiked(newLikedState);
      setLikeCount(optimisticLikeCount);
      
      // Call API
      const response = await apiToggleLikePost(postId);
      
      console.log('Like API response:', response); // Debug log
      
      if (response.success && response.data) {
        // Sync with server response
        console.log('Server returned - isLiked:', response.data.isLiked, 'likeCount:', response.data.likeCount);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
      } else {
        // If response is not successful, rollback
        console.error('API returned unsuccessful response:', response);
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        message.error('Không thể cập nhật lượt thích. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error (revert to opposite of current state)
      setIsLiked(!isLiked);
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
