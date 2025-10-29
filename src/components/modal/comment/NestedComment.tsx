import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import avatardf from '../../../assets/images/avatar_default.png';
import { formatTimeAgo } from '../../../utilities/helper';
import { apiGetRepliesByComment } from '../../../services/commentService';
import { TravelInput } from '../../ui/customize';
import { ExpandableContent } from '../../ui';

// Types
interface Comment {
  id?: string;
  avatarImg?: string;
  firstName: string;
  lastName: string;
  content: string;
  createdAt: string;
  replyCount?: number;
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
}

const NestedComment: React.FC<NestedCommentProps> = ({
  comment,
  level = 0,
  maxLevel = 2,
  postId: _postId,
  onReply,
  customFetchReplies,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(0);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canReply = level < maxLevel;
  const hasReplies = (comment.replyCount ?? 0) > 0;

  // Fetch replies when user clicks "View replies"
  const fetchReplies = async (page: number = 0) => {
    if (!comment.id || loadingReplies) return;

    console.log(`Fetching replies for comment ${comment.id}, page ${page}`);
    setLoadingReplies(true);
    try {
      const fetchFunction = customFetchReplies || apiGetRepliesByComment;
      const response = await fetchFunction(comment.id, page);
      console.log('Replies response:', response);
      const newReplies = response?.data?.content || [];
      console.log(`Received ${newReplies.length} replies`);
      
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
    if (!replyText.trim() || !comment.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onReply?.(comment.id, replyText);
      
      // Add new reply to local state
      const newReply: Comment = {
        id: `temp-${Date.now()}`,
        avatarImg: undefined,
        firstName: "Current",
        lastName: "User",
        content: replyText,
        createdAt: new Date().toISOString(),
        level: level + 1,
        parentCommentId: comment.id
      };
      
      setReplies(prev => [newReply, ...prev]);
      setReplyText('');
      setShowReplyInput(false);
      
      if (!showReplies) {
        setShowReplies(true);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
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

  // Calculate margin based on level
  const marginLeft = level > 0 ? `${level * 40}px` : '0px';

  return (
    <div style={{ marginLeft }}>
      <div className="flex w-full gap-3 mb-3">
        <img 
          src={comment?.avatarImg || avatardf} 
          alt="avatar" 
          className="flex-shrink-0 object-cover w-8 h-8 rounded-full" 
        />
        <div className="flex-1">
          <div className="px-3 py-2 bg-gray-100 rounded-2xl">
            <span className="text-sm font-semibold text-gray-800">
              {comment?.firstName} {comment?.lastName}
            </span>
            <ExpandableContent 
              content={comment?.content || ''} 
              maxLines={3} 
              className="mt-1 text-sm text-gray-700"
            />
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span className="transition-colors cursor-pointer hover:text-blue-500">
              Thích
            </span>
            {canReply && (
              <span 
                className="transition-colors cursor-pointer hover:text-blue-500"
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
                className="flex-shrink-0 object-cover w-6 h-6 rounded-full" 
              />
              <div className="flex-1">
                <TravelInput
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Trả lời ${comment?.firstName}...`}
                  disabled={isSubmitting}
                />
              </div>
              <button
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isSubmitting}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 transition-colors hover:text-blue-500"
              >
                <Icon 
                  icon={showReplies ? "fluent:chevron-up-24-filled" : "fluent:chevron-down-24-filled"} 
                  className="w-4 h-4" 
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
                key={reply.id || idx}
                comment={reply}
                level={level + 1}
                maxLevel={maxLevel}
                postId={_postId}
                onReply={onReply}
                customFetchReplies={customFetchReplies}
              />
            ))
          )}
          
          {/* Load More Replies */}
          {hasMoreReplies && replies.length > 0 && (
            <div style={{ marginLeft: `${(level + 1) * 40}px` }}>
              <button
                onClick={handleLoadMoreReplies}
                disabled={loadingReplies}
                className="text-xs font-semibold text-gray-600 transition-colors hover:text-blue-500 disabled:opacity-50"
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
    </div>
  );
};

export default NestedComment;
