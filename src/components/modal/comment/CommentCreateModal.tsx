import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TravelInput } from '../../ui/customize';
import avatardf from '../../../assets/images/avatar_default.png';

// Types
interface Comment {
  avatarImg?: string;
  firstName: string;
  lastName: string;
  content: string;
  createdAt: string;
}

interface CommentCreateModalProps {
  postId: string;
  handleComment?: (comment: Comment) => void;
  setNewComment: (comment: Comment) => void;
  currentUserAvatar?: string;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const CommentCreateModal: React.FC<CommentCreateModalProps> = ({
  postId: _postId,
  handleComment,
  setNewComment,
  currentUserAvatar,
  loading: _externalLoading = false,
  setLoading: setExternalLoading
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    // Set loading state
    setIsSubmitting(true);
    setExternalLoading?.(true);

    try {
      // Simulate comment creation
      const newComment: Comment = {
        avatarImg: currentUserAvatar,
        firstName: "Current",
        lastName: "User",
        content: commentText,
        createdAt: new Date().toISOString()
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNewComment(newComment);
      handleComment?.(newComment);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
      setExternalLoading?.(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 ">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <img
          src={currentUserAvatar || avatardf}
          alt="current user"
          className="flex-shrink-0 object-cover w-8 h-8 rounded-full border-2 border-gray-200"
        />
        <div className="flex-1">
          <TravelInput
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận..."
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang đăng...</span>
            </div>
          ) : (
            <Icon icon="fluent:send-24-filled" className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export { CommentCreateModal };