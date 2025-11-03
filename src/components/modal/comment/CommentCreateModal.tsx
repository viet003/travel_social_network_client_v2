import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TravelInput } from '../../ui/customize';
import avatardf from '../../../assets/images/avatar_default.png';
import { apiCreateCommentService } from '../../../services/commentService';
import { message } from 'antd';

// Types
interface Comment {
  commentId?: string;
  avatarImg?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  content: string;
  createdAt: string;
  replyCount?: number;
  parentCommentId?: string;
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
  postId,
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
      // Call API to create comment
      const response = await apiCreateCommentService({
        postId: postId,
        content: commentText
      });

      console.log('Comment created:', response);

      if (response.success && response.data) {
        // Create comment object from API response
        const newComment: Comment = {
          commentId: response.data.commentId,
          avatarImg: response.data.avatarImg,
          fullName: response.data.fullName,
          content: response.data.content,
          createdAt: response.data.createdAt,
          replyCount: response.data.replyCount || 0,
          parentCommentId: response.data.parentCommentId
        };

        setNewComment(newComment);
        handleComment?.(newComment);
        setCommentText('');
        
        message.success('Đã đăng bình luận!');
      } else {
        message.error('Không thể đăng bình luận. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      message.error('Không thể đăng bình luận. Vui lòng thử lại!');
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
          className="flex-shrink-0 object-cover w-10 h-10 rounded-full border-2 border-gray-200"
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
          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Icon icon="fluent:send-24-filled" className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export { CommentCreateModal };