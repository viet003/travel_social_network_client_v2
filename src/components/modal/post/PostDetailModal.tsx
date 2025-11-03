import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { CommentCreateModal, NestedComment } from '../comment';
import { formatTimeAgo, formatPrivacy } from '../../../utilities/helper';
import { LikeButton } from '../../common';
import { useNavigate } from 'react-router-dom';
import { TravelImage, ExpandableContent } from '../../ui';
import avatardf from '../../../assets/images/avatar_default.png';
import { apiGetAllCommentsByPost } from '../../../services/commentService';
import type { PostResponse as PostResponseType } from '../../../types/post.types';

// Types
interface Comment {
  id?: string;
  commentId?: string; // Backend uses commentId
  avatarImg?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string; // Backend uses fullName
  content: string;
  createdAt: string;
  replyCount?: number;
  level?: number;
  parentCommentId?: string;
}

interface Group {
  groupId: string;
  groupName: string;
  coverImageUrl?: string;
}

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  userId: string;
  avatar?: string;
  userName: string;
  location?: string;
  timeAgo: string;
  content: string;
  displayImages?: string[];
  displayVideo?: string;
  selectedImageIndex?: number;
  currentUserAvatar?: string;
  tags?: string[];
  isShare?: boolean;
  privacy?: string;
  group?: Group | null;
  postLikeCount?: number;
  setPostLikeCount?: (count: number) => void;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  postCommentCount?: number;
  handleComment?: (comment: Comment) => void;
  onCommentCountChange?: () => void; // Callback to increment comment count
  postShareCount?: number;
  onShare?: () => void;
  sharedPost?: PostResponseType | null;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  postId,
  userId,
  avatar,
  userName,
  location,
  timeAgo,
  content,
  displayImages = [],
  displayVideo,
  selectedImageIndex,
  currentUserAvatar,
  tags = [],
  isShare = false,
  privacy,
  group = null,
  postLikeCount = 0,
  setPostLikeCount,
  isLiked,
  setIsLiked,
  postCommentCount,
  handleComment,
  onCommentCountChange,
  postShareCount = 0,
  onShare,
  sharedPost,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(selectedImageIndex || 0);
  const [newComment, setNewComment] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const handleGroupClick = () => {
    if (group?.groupId) {
      navigate(`/home/groups/${group.groupId}`);
    }
  };

  // Hàm callback để theo dõi bài viết cuối cùng
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: '100px' }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Hàm tải bài viết của người dùng, hỗ trợ phân trang
  const fetchPostComments = async (pageNum: number) => {
    setLoading(true);
    try {
      const commentResponse = await apiGetAllCommentsByPost(postId, pageNum);
      console.log("User comments data:", commentResponse);
      const comments = commentResponse?.data?.content || [];
      if (pageNum === 0) {
        setComments(comments);
      } else {
        setComments((prevComments) => [...prevComments, ...comments]);
      }
      setHasMore(comments.length > 0);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tải bài viết khi page hoặc userId thay đổi
  useEffect(() => {
    if (!isOpen || !hasMore) return;
    fetchPostComments(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isOpen]);

  useEffect(() => {
    if (newComment) {
      setComments(prev => [newComment, ...prev]);
    }
  }, [newComment]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const renderVideo = (videoUrl: string) => (
    <div className="relative mb-3">
      <video
        src={videoUrl}
        controls
        className="object-cover w-full max-h-[350px] rounded-lg"
        poster=""
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );

  const renderSingleImage = (img: string, index: number) => (
    <div key={index} style={{ marginBottom: '12px' }}>
      <TravelImage
        src={img}
        alt="post"
        onClick={() => handleImageClick(index)}
        preview={{
          mask: 'Xem ảnh',
        }}
      />
    </div>
  );

  const renderImageSlider = () => {
    if (displayImages.length === 0) return null;

    if (displayImages.length === 1) {
      return renderSingleImage(displayImages[0], 0);
    }

    return (
      <div className="relative mb-3">
        {/* Main Image */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', maxHeight: '350px' }}>
          <TravelImage
            src={displayImages[currentImageIndex]}
            alt={`post-${currentImageIndex}`}
            preview={{
              mask: 'Xem ảnh',
            }}
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevImage}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95"
          >
            <Icon icon="fluent:chevron-left-20-filled" className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95"
          >
            <Icon icon="fluent:chevron-right-24-filled" className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute px-2 py-1 text-sm text-white bg-black bg-opacity-50 rounded-full bottom-2 right-2">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      </div>
    );
  };

  const renderTags = () => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs text-blue-600 transition-colors bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  const renderGroupHeader = () => {
    if (!group) return null;

    return (
      <div className="mb-3">
        <div className="flex items-center gap-3 p-2">
          {/* Group Cover with Avatar Overlay */}
          <div className="relative">
            <img
              src={group.coverImageUrl || avatardf}
              alt={group.groupName}
              className="w-12 h-12 object-cover rounded-lg"
            />
            {/* User Avatar Overlay */}
            <img 
              src={avatar || avatardf} 
              alt="avatar" 
              className="absolute -bottom-1 -right-1 w-7 h-7 object-cover rounded-full border-2 border-white cursor-pointer"
              onClick={() => { navigate(`/user/${userId}`) }}
            />
          </div>
          
          {/* Group and User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span 
                className="font-semibold text-gray-800 hover:underline cursor-pointer"
                onClick={handleGroupClick}
              >
                {group.groupName}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">{formatTimeAgo(timeAgo)}</span>
              <span className="text-gray-500">•</span>
              <Icon icon="fluent:globe-24-filled" className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <span 
                className="hover:underline cursor-pointer"
                onClick={() => { navigate(`/user/${userId}`) }}
              >
                {userName}
              </span>
              {location && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{location}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Menu button */}
          <div className="ml-auto">
            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUserHeader = () => {
    if (group) return null; // Don't render if group exists

    return (
      <div className="flex items-center gap-3 mb-3">
        <img 
          src={avatar || avatardf} 
          alt="avatar" 
          className="object-cover w-10 h-10 rounded-full cursor-pointer" 
          onClick={() => { navigate(`/user/${userId}`) }}
        />
        <div className='flex flex-col'>
          <div className="flex items-center gap-2">
            <span 
              className="font-semibold text-gray-800 cursor-pointer hover:underline"
              onClick={() => { navigate(`/user/${userId}`) }}
            >
              {userName}
            </span>
            {location && <span className="text-xs text-gray-500">• {location}</span>}
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            {formatTimeAgo(timeAgo)}
            <Icon icon="fluent:globe-24-filled" className="w-3 h-3" />
            {privacy && <span className="ml-1 text-xs">• {formatPrivacy(privacy)}</span>}
          </span>
        </div>
      </div>
    );
  };

  const renderSharedPost = () => {
    if (!sharedPost) return null;

    const sharedImages = sharedPost.mediaList?.filter(m => m.type === 'IMAGE').map(m => m.url) || [];
    const sharedVideo = sharedPost.mediaList?.find(m => m.type === 'VIDEO')?.url;

    return (
      <div className="p-4 mt-3 border-2 border-gray-200 rounded-lg bg-gray-50">
        {/* Shared Post Header */}
        {sharedPost.group ? (
          <div className="mb-3">
            <div className="flex items-center gap-3">
              {/* Group Cover with Avatar Overlay */}
              <div className="relative">
                <img
                  src={sharedPost.group.coverImageUrl || avatardf}
                  alt={sharedPost.group.groupName}
                  className="object-cover w-10 h-10 rounded-lg"
                />
                <img 
                  src={sharedPost.user?.avatarImg || avatardf} 
                  alt="avatar" 
                  className="absolute object-cover border-2 border-white rounded-full cursor-pointer -bottom-1 -right-1 w-6 h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${sharedPost.user?.userId}`);
                  }}
                />
              </div>
              
              {/* Group and User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-sm font-semibold text-gray-800 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sharedPost.group?.groupId) {
                        navigate(`/home/groups/${sharedPost.group.groupId}`);
                      }
                    }}
                  >
                    {sharedPost.group.groupName}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(sharedPost.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${sharedPost.user?.userId}`);
                    }}
                  >
                    {sharedPost.user?.fullName}
                  </span>
                  {sharedPost.location && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{sharedPost.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={sharedPost.user?.avatarImg || avatardf} 
              alt="avatar" 
              className="object-cover rounded-full cursor-pointer w-9 h-9" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user/${sharedPost.user?.userId}`);
              }}
            />
            <div className='flex flex-col'>
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm font-semibold text-gray-800 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${sharedPost.user?.userId}`);
                  }}
                >
                  {sharedPost.user?.fullName}
                </span>
                {sharedPost.location && <span className="text-xs text-gray-500">• {sharedPost.location}</span>}
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                {formatTimeAgo(sharedPost.createdAt)}
                <Icon icon="fluent:globe-24-filled" className="w-3 h-3" />
                {sharedPost.privacy && <span className="ml-1 text-xs">• {formatPrivacy(sharedPost.privacy)}</span>}
              </span>
            </div>
          </div>
        )}

        {/* Shared Post Content */}
        {sharedPost.content && (
          <div className="mb-3">
            <ExpandableContent content={sharedPost.content} maxLines={3} />
          </div>
        )}

        {/* Shared Post Tags */}
        {sharedPost.tags && sharedPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {sharedPost.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-blue-600 transition-colors bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Shared Post Media */}
        {sharedVideo && (
          <div className="relative">
            <video
              src={sharedVideo}
              controls
              className="object-cover w-full rounded-lg max-h-80"
              poster=""
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {!sharedVideo && sharedImages.length > 0 && (
          <div className="grid gap-2">
            {sharedImages.length === 1 && (
              <TravelImage
                src={sharedImages[0]}
                alt="shared-post"
                preview={{ mask: 'Xem ảnh' }}
              />
            )}
            {sharedImages.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {sharedImages.map((img: string, idx: number) => (
                  <TravelImage
                    key={idx}
                    src={img}
                    alt={`shared-post-${idx}`}
                    preview={{ mask: 'Xem ảnh' }}
                  />
                ))}
              </div>
            )}
            {sharedImages.length === 3 && (
              <div className="grid gap-2">
                <TravelImage
                  src={sharedImages[0]}
                  alt="shared-post-0"
                  preview={{ mask: 'Xem ảnh' }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <TravelImage
                    src={sharedImages[1]}
                    alt="shared-post-1"
                    preview={{ mask: 'Xem ảnh' }}
                  />
                  <TravelImage
                    src={sharedImages[2]}
                    alt="shared-post-2"
                    preview={{ mask: 'Xem ảnh' }}
                  />
                </div>
              </div>
            )}
            {sharedImages.length >= 4 && (
              <div className="grid grid-cols-2 gap-2">
                {sharedImages.slice(0, 4).map((img: string, idx: number) => (
                  <div key={idx} className="relative">
                    <TravelImage
                      src={img}
                      alt={`shared-post-${idx}`}
                      preview={{ mask: 'Xem ảnh' }}
                    />
                    {idx === 3 && sharedImages.length > 4 && (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white bg-black bg-opacity-50 rounded-lg">
                        +{sharedImages.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-screen flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50"
      style={{ zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-6 bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon icon="fluent:compass-northwest-24-regular" className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {group ? (
                <>
                  <span 
                    className="hover:underline cursor-pointer !text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/home/groups/${group.groupId}`);
                    }}
                  >
                    {group.groupName}
                  </span>
                  {' - Bài viết của '}
                  <span 
                    className="hover:underline cursor-pointer !text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/home/user/${userId}`);
                    }}
                  >
                    @{userName}
                  </span>
                </>
              ) : (
                <>
                  {'Bài viết của '}
                  <span 
                    className="hover:underline cursor-pointer text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/home/user/${userId}`);
                    }}
                  >
                    @{userName}
                  </span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500">Xem chi tiết bài viết</p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Original Post */}
          <div className="p-6 border-b border-gray-100">
            {isShare && (
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                <Icon icon="fluent:arrow-reply-24-filled" className="w-4 h-4" />
                <span>Đã chia sẻ một bài viết</span>
              </div>
            )}
            
            {/* Group Header or User Header */}
            {renderGroupHeader()}
            {renderUserHeader()}

            {/* Content with HTML and "See more" functionality */}
            <ExpandableContent content={content} maxLines={3} />

            {/* Tags */}
            {renderTags()}

            {/* Shared Post Preview */}
            {isShare && sharedPost && renderSharedPost()}

            {/* Main Media Display - Only show if not a share post */}
            {!isShare && displayVideo && renderVideo(displayVideo)}
            {!isShare && displayImages.length > 0 && renderImageSlider()}

            {/* Action buttons */}
            <div className="flex items-center gap-6 pt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-2-2-2 2m0 6l2 2 2-2" />
                </svg>
              </div>
              <LikeButton 
                postId={postId} 
                isLiked={isLiked || false} 
                setIsLiked={setIsLiked || (() => {})} 
                likeCount={postLikeCount} 
                setLikeCount={setPostLikeCount || (() => {})} 
              />
              <div className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-500">
                <Icon icon="fluent:chat-24-filled" className="w-5 h-5" />
                {postCommentCount}
              </div>
              <div className="flex items-center gap-1 transition-colors cursor-pointer hover:text-green-500" onClick={onShare}>
                <Icon icon="fluent:arrow-reply-24-filled" className="w-5 h-5" />
                {postShareCount}
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="p-6 space-y-3">
            {/* Comments Header */}
            <div className="flex items-center gap-2 mb-6">
              <Icon icon="fluent:comment-multiple-24-filled" className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Comments ({postCommentCount})
              </h2>
            </div>
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <Icon icon="fluent:comment-24-regular" className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700">Chưa có bình luận nào</h3>
                <p className="text-sm text-gray-500">Hãy là người đầu tiên bình luận.</p>
              </div>
            ) : (
              <>
                {comments.map((comment, idx) => (
                  <div key={comment.id || comment.commentId || idx} ref={comments.length === idx + 1 ? lastCommentElementRef : null}>
                    <NestedComment
                      comment={comment}
                      level={0}
                      maxLevel={2}
                      postId={postId}
                      onReply={(parentId, content) => {
                        console.log('Reply to:', parentId, 'Content:', content);
                        // Handle reply logic here
                      }}
                      onCommentCreated={onCommentCountChange}
                    />
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-gray-500">Đang tải thêm bình luận...</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className='h-[10px]'></div>
          {/* Comment Input */}
          <div className='absolute bottom-0 left-0 w-full bg-white rounded-b-xl'>
             <CommentCreateModal 
               postId={postId} 
               handleComment={handleComment || (() => {})} 
               setNewComment={(comment: Comment) => setNewComment(comment)} 
               currentUserAvatar={currentUserAvatar} 
               loading={loading} 
               setLoading={setLoading} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;


