import React, { useState } from 'react';
import { Icon } from '@iconify/react';

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

  const handleLike = async () => {
    try {
      // Simulate API call
      console.log('Toggling like for post:', postId);
      
      // Toggle like state
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
      
      // Trigger animation only when liking (not unliking)
      if (newLikedState) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
      }
      
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <button
      type="button"
      className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'} ${className}`}
      onClick={handleLike}
    >
      <span 
        className={`inline-block ${isAnimating ? 'animate-like-bounce' : ''}`}
        style={{
          animation: isAnimating ? 'likeAnimation 0.6s ease-in-out' : 'none'
        }}
      >
        {isLiked ? <Icon icon="fluent:heart-24-filled" className="w-5 h-5" /> : <Icon icon="fluent:heart-24-regular" className="w-5 h-5" />}
      </span>
      {likeCount}
    </button>
  );
};

export default LikeButton;
