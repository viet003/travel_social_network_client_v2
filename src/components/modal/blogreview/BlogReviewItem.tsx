import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import avatardf from '../../../assets/images/avatar_default.png';
import { formatTimeAgo } from '../../../utilities/helper';
import { apiUpdateBlogReview, apiDeleteBlogReview } from '../../../services/blogReviewService';
import { TravelInput } from '../../ui/customize';
import { ExpandableContent } from '../../ui';
import { message } from 'antd';

interface AuthState {
  userId: string | null;
  userName: string | null;
  fullName: string | null;
  avatar: string | null;
  isLoggedIn: boolean;
}

interface BlogComment {
  commentId: string;
  user: {
    userId?: string;
    userName: string;
    avatarImg?: string;
  };
  content: string;
  rating?: number;
  isEdited: boolean;
  isReview: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogReviewItemProps {
  comment: BlogComment;
  onCommentDeleted: (commentId: string) => void;
  onCommentUpdated: (commentId: string, newContent: string) => void;
}

const BlogReviewItem: React.FC<BlogReviewItemProps> = ({
  comment,
  onCommentDeleted,
  onCommentUpdated,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localContent, setLocalContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const longPressTimerRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const currentUser = useSelector((state: { auth: AuthState }) => state.auth);
  const currentUserId = currentUser.userId;
  const isOwner = comment.user.userId === currentUserId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLongPressStart = () => {
    if (!isOwner) return;

    longPressTimerRef.current = window.setTimeout(() => {
      setShowDropdown(true);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleEditComment = async () => {
    if (!editText.trim() || !comment.commentId || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await apiUpdateBlogReview(comment.commentId, editText.trim());

      if (response.success) {
        setLocalContent(editText.trim());
        setIsEditing(false);
        setShowDropdown(false);
        onCommentUpdated(comment.commentId, editText.trim());
        message.success('Đã cập nhật!');
      } else {
        message.error('Không thể cập nhật!');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      message.error('Không thể cập nhật!');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComment = () => {
    setShowDropdown(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!comment.commentId || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await apiDeleteBlogReview(comment.commentId);

      if (response.success) {
        message.success('Đã xóa!');
        setShowDeleteConfirm(false);
        onCommentDeleted(comment.commentId);
      } else {
        message.error('Không thể xóa!');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('Không thể xóa!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex w-full gap-3 mb-3">
        <img
          src={comment.user?.avatarImg || avatardf}
          alt="avatar"
          className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div
            className="relative px-3 py-1 bg-gray-100 rounded-2xl cursor-pointer"
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            style={{ userSelect: 'none' }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-gray-800">
                {comment.user.userName}
              </span>
              {comment.isReview && comment.rating && (
                <div className="flex items-center gap-0.5 ml-auto">
                  {[...Array(comment.rating)].map((_, i) => (
                    <Icon key={i} icon="mdi:star" className="w-3.5 h-3.5 text-yellow-500" />
                  ))}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1">
                  <TravelInput
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={isUpdating}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={handleEditComment}
                  disabled={!editText.trim() || isUpdating}
                  className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-all duration-200 bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Icon icon="fluent:send-24-filled" className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <ExpandableContent
                content={localContent || ''}
                maxLines={3}
                className="mt-0.5 text-sm text-gray-700"
              />
            )}

            {showDropdown && isOwner && !isEditing && (
              <div
                ref={dropdownRef}
                className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl top-full w-72"
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                    className="flex items-start w-full gap-3 px-3 py-2 transition-colors cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 mt-0.5 bg-gray-200 rounded-full">
                      <Icon icon="fluent:edit-24-regular" className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium leading-tight text-gray-900">Chỉnh sửa</p>
                      <p className="mt-0.5 text-xs leading-tight text-gray-500">
                        Sửa nội dung {comment.isReview ? 'đánh giá' : 'bình luận'}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={handleDeleteComment}
                    disabled={isDeleting}
                    className="flex items-start w-full gap-3 px-3 py-2 transition-colors cursor-pointer hover:bg-gray-100 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 mt-0.5 bg-gray-200 rounded-full">
                      <Icon icon="fluent:delete-24-regular" className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium leading-tight text-gray-900">Xóa</p>
                      <p className="mt-0.5 text-xs leading-tight text-gray-500">
                        Xóa vĩnh viễn
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{formatTimeAgo(comment.createdAt)}</span>
            {comment.isEdited && (
              <span>• đã chỉnh sửa</span>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-[90vw] p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <Icon icon="fluent:delete-24-filled" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Xóa {comment.isReview ? 'đánh giá' : 'bình luận'}
              </h3>
            </div>
            <p className="mb-6 text-gray-600">
              Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 cursor-pointer px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 cursor-pointer px-4 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogReviewItem;
