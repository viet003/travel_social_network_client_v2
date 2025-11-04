import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import avatardf from '../../../assets/images/avatar_default.png';
import { formatTimeAgo } from '../../../utilities/helper';
import { apiGetRepliesByComment, apiCreateCommentService, apiToggleLikeComment, apiUpdateComment, apiDeleteComment } from '../../../services/commentService';
import { TravelInput } from '../../ui/customize';
import { ExpandableContent } from '../../ui';
import { message } from 'antd';

// Types
interface AuthState {
  userId: string | null;
  userName: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  cover: string | null;
  isLoggedIn: boolean;
  token: string | null;
  msg: string;
}

interface Comment {
  id?: string;
  commentId?: string; // Backend uses commentId
  userId?: string; // ID of the user who created the comment
  avatarImg?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Backend uses fullName
  content: string;
  createdAt: string;
  replyCount?: number;
  likeCount?: number; // Number of likes on comment
  liked?: boolean; // Whether current user has liked
  level?: number;
  parentCommentId?: string;
}

interface NestedCommentProps {
  comment: Comment;
  level?: number;
  maxLevel?: number;
  postId: string;
  onReply?: (parentId: string, content: string) => void;
  customFetchReplies?: (commentId: string, page: number) => Promise<{ data: { content: Comment[] } }>;
  onCommentCreated?: () => void; // Callback to increment post comment count
  onCommentDeleted?: (commentId: string) => void; // Callback when comment is deleted
}

const NestedComment: React.FC<NestedCommentProps> = ({
  comment,
  level = 0,
  maxLevel = 2,
  postId: _postId,
  onReply,
  customFetchReplies,
  onCommentCreated,
  onCommentDeleted,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.liked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // New states for edit/delete functionality
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localContent, setLocalContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const longPressTimerRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Get current user ID from Redux
  const currentUserId = useSelector((state: { auth: AuthState }) => state.auth.userId);
  
  const canReply = level < maxLevel;
  const hasReplies = (comment.replyCount ?? 0) > 0;
  const commentId = comment.id || comment.commentId; // Support both field names
  const isOwner = comment.userId === currentUserId;

  // Fetch replies when user clicks "View replies"
  const fetchReplies = async (page: number = 0) => {
    if (!commentId || loadingReplies) return;

    setLoadingReplies(true);
    try {
      const fetchFunction = customFetchReplies || apiGetRepliesByComment;
      const response = await fetchFunction(commentId, page);
      const newReplies = response?.data?.content || [];
      
      if (page === 0) {
        setReplies(newReplies);
      } else {
        setReplies(prev => [...prev, ...newReplies]);
      }
      
      setHasMoreReplies(newReplies.length > 0);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleShowReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies(0);
    }
    setShowReplies(!showReplies);
  };

  const handleLoadMoreReplies = () => {
    const nextPage = replyPage + 1;
    setReplyPage(nextPage);
    fetchReplies(nextPage);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !commentId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Call API to create reply
      const response = await apiCreateCommentService({
        postId: _postId,
        content: replyText,
        parentCommentId: commentId
      });
      
      console.log('Reply created:', response);
      
      if (response.success && response.data) {
        // Add new reply from API response to local state
        const newReply: Comment = {
          id: response.data.commentId,
          commentId: response.data.commentId,
          userId: response.data.userId,
          avatarImg: response.data.avatarImg,
          fullName: response.data.fullName,
          content: response.data.content,
          createdAt: response.data.createdAt,
          level: level + 1,
          parentCommentId: response.data.parentCommentId,
          replyCount: response.data.replyCount || 0
        };
        
        setReplies(prev => [newReply, ...prev]);
        setReplyText('');
        setShowReplyInput(false);
        
        if (!showReplies) {
          setShowReplies(true);
        }
        
        // Call parent callback if exists
        onReply?.(commentId, replyText);
        
        // Increment post comment count on client
        onCommentCreated?.();
        
        message.success('Đã trả lời bình luận!');
      } else {
        message.error('Không thể tạo phản hồi. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      message.error('Không thể tạo phản hồi. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showReplies && replyPage > 0) {
      fetchReplies(replyPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyPage]);

  // Close dropdown when clicking outside
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

  // Long press handlers
  const handleLongPressStart = () => {
    if (!isOwner) return;
    
    longPressTimerRef.current = window.setTimeout(() => {
      setShowDropdown(true);
    }, 500); // 500ms long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(localContent);
  };

  const handleEditComment = async () => {
    if (!editText.trim() || !commentId || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await apiUpdateComment(commentId, editText.trim());
      
      if (response.success) {
        setLocalContent(editText.trim());
        setIsEditing(false);
        setShowDropdown(false);
        message.success('Đã cập nhật bình luận!');
      } else {
        message.error('Không thể cập nhật bình luận!');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      message.error('Không thể cập nhật bình luận!');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete comment handler
  const handleDeleteComment = () => {
    setShowDropdown(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!commentId || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await apiDeleteComment(commentId);
      
      if (response.success) {
        message.success('Đã xóa bình luận!');
        setShowDeleteConfirm(false);
        
        // Notify parent component to remove this comment
        if (onCommentDeleted) {
          onCommentDeleted(commentId);
        }
        
        // Also decrement comment count
        if (onCommentCreated) {
          onCommentCreated();
        }
      } else {
        message.error('Không thể xóa bình luận!');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('Không thể xóa bình luận!');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLikeComment = async () => {
    if (!commentId || isLiking) return;

    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    const newLikedState = !isLiked;
    
    // Trigger animation only when liking
    if (newLikedState) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    setIsLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

    try {
      const response = await apiToggleLikeComment(commentId);
      
      if (response.success && response.data) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      } else {
        // Rollback on error
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        message.error('Không thể thích bình luận!');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      message.error('Không thể thích bình luận!');
    } finally {
      setIsLiking(false);
    }
  };

  // Calculate margin based on level
  const marginLeft = level > 0 ? `${level * 40}px` : '0px';
  
  // Get display name
  const displayName = comment.fullName || `${comment.firstName || ''} ${comment.lastName || ''}`.trim();

  return (
    <div style={{ marginLeft }}>
      <div className="flex w-full gap-3 mb-3">
        <img 
          src={comment?.avatarImg || avatardf} 
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
            <span className="text-sm font-semibold text-gray-800">
              {displayName}
            </span>
            
            {/* Edit mode */}
            {isEditing ? (
              <div 
                className="flex items-center gap-2 mt-1"
                onBlur={(e) => {
                  // Only cancel if blur is not to the send button
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    handleEditCancel();
                  }
                }}
              >
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
            
            {/* Dropdown menu */}
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
                      <p className="text-sm font-medium leading-tight text-gray-900">
                        Chỉnh sửa
                      </p>
                      <p className="mt-0.5 text-xs leading-tight text-gray-500">
                        Sửa nội dung bình luận của bạn
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
                      <p className="text-sm font-medium leading-tight text-gray-900">
                        Xóa
                      </p>
                      <p className="mt-0.5 text-xs leading-tight text-gray-500">
                        Xóa bình luận này vĩnh viễn
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <button
              onClick={handleLikeComment}
              disabled={isLiking}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span 
                className={`inline-block ${isAnimating ? 'animate-like-bounce' : ''}`}
                style={{
                  animation: isAnimating ? 'likeAnimation 0.6s ease-in-out' : 'none'
                }}
              >
                {isLiked ? (
                  <Icon icon="fluent:heart-24-filled" className="w-3.5 h-3.5" />
                ) : (
                  <Icon icon="fluent:heart-24-regular" className="w-3.5 h-3.5" />
                )}
              </span>
              {likeCount > 0 && <span>{likeCount}</span>}
              <span className="hidden sm:inline">Thích</span>
            </button>
            {canReply && (
              <span 
                className="transition-colors duration-200 cursor-pointer hover:text-blue-500"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                Trả lời
              </span>
            )}
            <span>{formatTimeAgo(comment?.createdAt)}</span>
          </div>

          {/* Reply Input */}
          {showReplyInput && canReply && (
            <div className="flex items-center gap-2 mt-2">
              <img 
                src={avatardf} 
                alt="current user" 
                className="flex-shrink-0 object-cover w-8 h-8 rounded-full border-2 border-gray-200" 
              />
              <div className="flex-1">
                <TravelInput
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Trả lời ${displayName}...`}
                  disabled={isSubmitting}
                />
              </div>
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isSubmitting}
                className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon icon="fluent:send-24-filled" className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Show/Hide Replies Button */}
          {hasReplies && (
            <div className="mt-2">
              <button
                onClick={handleShowReplies}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 transition-colors duration-200 cursor-pointer hover:text-blue-500"
              >
                <Icon 
                  icon={showReplies ? "fluent:chevron-up-24-filled" : "fluent:chevron-down-24-filled"} 
                  className="w-4 h-4 transition-transform duration-200" 
                />
                {showReplies ? 'Ẩn' : 'Xem'} {comment.replyCount} phản hồi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies && (
        <div>
          {loadingReplies && replies.length === 0 ? (
            <div style={{ marginLeft: `${(level + 1) * 40}px` }} className="py-2">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Đang tải phản hồi...
              </span>
            </div>
          ) : replies.length === 0 ? (
            <div style={{ marginLeft: `${(level + 1) * 40}px` }} className="py-2">
              <span className="text-xs text-gray-500">Chưa có phản hồi nào</span>
            </div>
          ) : (
            replies.map((reply, idx) => (
              <NestedComment
                key={reply.id || reply.commentId || idx}
                comment={reply}
                level={level + 1}
                maxLevel={maxLevel}
                postId={_postId}
                onReply={onReply}
                customFetchReplies={customFetchReplies}
                onCommentCreated={onCommentCreated}
                onCommentDeleted={(deletedId) => {
                  // Remove deleted reply from local state
                  setReplies(prev => prev.filter(r => (r.id || r.commentId) !== deletedId));
                  // Notify parent
                  onCommentDeleted?.(deletedId);
                }}
              />
            ))
          )}
          
          {/* Load More Replies */}
          {hasMoreReplies && replies.length > 0 && (
            <div style={{ marginLeft: `${(level + 1) * 40}px` }}>
              <button
                onClick={handleLoadMoreReplies}
                disabled={loadingReplies}
                className="text-xs font-semibold text-gray-600 transition-colors duration-200 cursor-pointer hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingReplies ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Đang tải...
                  </span>
                ) : (
                  'Xem thêm phản hồi'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-[90vw] p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <Icon icon="fluent:delete-24-filled" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Xóa bình luận</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
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
    </div>
  );
};

export default NestedComment;
