import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { SlHeart } from 'react-icons/sl';

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
  const handleLike = async () => {
    try {
      // Simulate API call
      console.log('Toggling like for post:', postId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Toggle like state
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
      
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
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
      {isLiked ? <FaHeart className="w-5 h-5 fill-current" /> : <SlHeart className="w-5 h-5" />}
      {likeCount}
    </button>
  );
};

export default LikeButton;
