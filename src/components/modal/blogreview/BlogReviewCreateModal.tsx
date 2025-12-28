import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TravelInput } from '../../ui/customize';
import avatardf from '../../../assets/images/avatar_default.png';
import { apiCreateBlogReview } from '../../../services/blogReviewService';
import { message } from 'antd';

interface BlogReviewCreateModalProps {
  blogId: string;
  currentUserAvatar?: string;
  onCommentCreated: () => void;
  onNewComment: (comment: BlogComment) => void;
}

interface BlogComment {
  commentId: string;
  user: {
    userName: string;
    avatarImg?: string;
  };
  content: string;
  rating: number; // Always required (1-5 stars)
  likeCount: number;
  isEdited: boolean;
  isReview: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogReviewCreateModal: React.FC<BlogReviewCreateModalProps> = ({
  blogId,
  currentUserAvatar,
  onCommentCreated,
  onNewComment,
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        blogId,
        content: commentText,
        rating: rating, // Always required
      };

      const response = await apiCreateBlogReview(payload);

      if (response.success && response.data) {
        const commentData = response.data as BlogComment;
        const newComment: BlogComment = {
          commentId: commentData.commentId,
          user: commentData.user,
          content: commentData.content,
          rating: commentData.rating,
          likeCount: commentData.likeCount || 0,
          isEdited: commentData.isEdited || false,
          isReview: commentData.isReview || false,
          createdAt: commentData.createdAt,
          updatedAt: commentData.updatedAt,
        };

        onNewComment(newComment);
        onCommentCreated();
        setCommentText('');
        setRating(5);

        message.success('Đã đăng đánh giá!');
      } else {
        message.error('Không thể đăng. Vui lòng thử lại!');
      }
    } catch (error: unknown) {
      console.error('Error posting comment:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        message.error((error as { message: string }).message || 'Không thể đăng. Vui lòng thử lại!');
      } else {
        message.error('Không thể đăng. Vui lòng thử lại!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="p-4 border-t border-gray-200">
      {/* Star Rating - Always visible */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:star" className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Đánh giá bài viết</span>
          </div>
          {rating > 0 && (
            <span className="text-sm font-semibold text-yellow-600">
              {rating} sao
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star === rating && rating === 1 ? 1 : star)}
              className="transition-transform hover:scale-110 cursor-pointer"
            >
              <Icon
                icon={star <= displayRating ? "mdi:star" : "mdi:star-outline"}
                className={`w-8 h-8 ${
                  star <= displayRating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
        Lưu ý: Bạn chỉ có thể đánh giá 1 lần cho bài viết này
      </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
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
            placeholder="Viết đánh giá của bạn..."
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

export { BlogReviewCreateModal };
