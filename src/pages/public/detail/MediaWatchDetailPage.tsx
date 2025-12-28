import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { message } from "antd";
import { useSelector } from "react-redux";
import { TravelButton } from "../../../components/ui/customize";
import {
  CommentCreateModal,
  NestedComment,
  CommentSortDropdown,
  type SortOption,
} from "../../../components/modal/comment";
import { ExpandableContent } from "../../../components/ui";
import { LikeButton } from "../../../components/common/buttons";
import avatardf from "../../../assets/images/avatar_default.png";
import { apiGetCommentsByWatchId } from "../../../services/commentService";
import { apiGetWatchById, apiAddToHistory } from "../../../services/watchService";
import type { RootState } from "../../../stores/types/storeTypes";
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import type { WatchResponse } from "../../../types/watch.types";
import type { CommentResponse } from "../../../types/comment.types";
import "../../../styles/post-modal.css";

const MediaWatchDetailPage: React.FC = () => {
  const { watchId } = useParams<{ watchId: string }>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const [watchData, setWatchData] = useState<WatchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [commentPage, setCommentPage] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<CommentResponse | null>(null);
  const [commentSort, setCommentSort] = useState<SortOption>("most_relevant");

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [shareCount, setShareCount] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTrackedView = useRef<boolean>(false);
  const viewTrackingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track video view and add to history
  useEffect(() => {
    const trackView = async () => {
      if (!watchId || hasTrackedView.current || !auth.isLoggedIn) return;
      
      try {
        await apiAddToHistory(watchId);
        hasTrackedView.current = true;
      } catch (error) {
        console.error("Error adding to history:", error);
      }
    };

    const handleVideoPlay = () => {
      if (hasTrackedView.current || !videoRef.current) return;

      const duration = videoRef.current.duration;
      const THIRTY_MINUTES = 30 * 60; // 30 minutes in seconds

      // Clear any existing timeout
      if (viewTrackingTimeout.current) {
        clearTimeout(viewTrackingTimeout.current);
      }

      if (duration > THIRTY_MINUTES) {
        // Video > 30 minutes: track after 30 minutes of watch time
        viewTrackingTimeout.current = setTimeout(() => {
          trackView();
        }, THIRTY_MINUTES * 1000);
      }
      // For videos <= 30 minutes, track on ended event
    };

    const handleVideoEnded = () => {
      if (hasTrackedView.current || !videoRef.current) return;

      const duration = videoRef.current.duration;
      const THIRTY_MINUTES = 30 * 60;

      // Only track on ended if video <= 30 minutes
      if (duration <= THIRTY_MINUTES) {
        trackView();
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handleVideoPlay);
      videoElement.addEventListener('ended', handleVideoEnded);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handleVideoPlay);
        videoElement.removeEventListener('ended', handleVideoEnded);
      }
      if (viewTrackingTimeout.current) {
        clearTimeout(viewTrackingTimeout.current);
      }
    };
  }, [watchId, auth.isLoggedIn]);

  useEffect(() => {
    const fetchWatchByWatchId = async () => {
      if (!watchId) return;

      setLoading(true);
      try {
        // Fetch watch by watchId
        const response = await apiGetWatchById(watchId);
        const watch = response.data;

        setWatchData(watch);
        setIsLiked(watch.liked || false);
        setLikeCount(watch.likeCount);
        setCommentCount(watch.commentCount);
        setShareCount(watch.shareCount);
      } catch (error) {
        console.error("Error fetching watch:", error);
        message.error("Không thể tải video");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchByWatchId();
  }, [watchId]);

  const fetchComments = useCallback(
    async (pageNum: number) => {
      if (!watchData?.watchId) return;

      setLoadingComments(true);
      try {
        // Fetch comments for watch using watch-specific endpoint
        const commentResponse = await apiGetCommentsByWatchId(
          watchData.watchId,
          pageNum,
          commentSort
        );
        const newComments = commentResponse?.data?.content || [];

        if (pageNum === 0) {
          setComments(newComments);
        } else {
          setComments((prev) => [...prev, ...newComments]);
        }

        setHasMoreComments(newComments.length > 0);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    },
    [watchData?.watchId, commentSort]
  );

  useEffect(() => {
    if (watchData?.watchId && hasMoreComments) {
      fetchComments(commentPage);
    }
  }, [commentPage, watchData?.watchId, hasMoreComments, fetchComments]);

  useEffect(() => {
    if (newComment) {
      setComments((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
    }
  }, [newComment]);

  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingComments || !hasMoreComments) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreComments) {
            setCommentPage((prevPage) => prevPage + 1);
          }
        },
        { rootMargin: "100px" }
      );

      if (node) observer.current.observe(node);
    },
    [loadingComments, hasMoreComments]
  );

  const handleCommentCountChange = () => {
    setCommentCount((prev) => prev + 1);
  };

  const handleCommentDeleted = () => {
    setCommentCount((prev) => Math.max(0, prev - 1));
  };

  const handleShareClick = () => {
    message.info("Chức năng chia sẻ đang được phát triển");
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-56px)] bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!watchData) {
    return (
      <div className="h-[calc(100vh-56px)] bg-black flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="fluent:error-circle-24-regular"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
          />
          <p className="text-gray-400 mb-4">Không tìm thấy video</p>
          <TravelButton type="primary" onClick={() => navigate(-1)}>
            Quay lại
          </TravelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] bg-black flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm z-50 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <Icon
                  icon="fluent:arrow-left-24-filled"
                  className="h-6 w-6 text-gray-700"
                />
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={watchData.user?.avatarImg || avatardf}
                  alt={watchData.user?.userProfile?.fullName || watchData.user?.userName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() =>
                    navigate(`/home/user/${watchData.user?.userId}`)
                  }
                />
                <div>
                  <h2
                    className="font-semibold text-gray-900 hover:underline cursor-pointer text-sm"
                    onClick={() =>
                      navigate(`/home/user/${watchData.user?.userId}`)
                    }
                  >
                    {watchData.user?.userProfile?.fullName || watchData.user?.userName}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{formatTimeAgo(watchData.createdAt)}</span>
                    <Icon
                      icon="fluent:globe-24-filled"
                      className="w-3 h-3 ml-1"
                    />
                    {watchData.privacy && (
                      <span className="ml-1">
                        • {formatPrivacy(watchData.privacy)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComments(!showComments)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer md:hidden"
              >
                <Icon
                  icon="fluent:comment-24-regular"
                  className="h-6 w-6 text-gray-700"
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <Icon
                  icon="fluent:search-24-regular"
                  className="h-6 w-6 text-gray-700"
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <Icon
                  icon="fluent:more-horizontal-24-filled"
                  className="h-6 w-6 text-gray-700"
                />
              </button>
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <Icon
                  icon="fluent:dismiss-24-filled"
                  className="h-6 w-6 text-gray-700"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Video Player */}
        <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
          <div className="w-full h-[calc(100vh-112px)] flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={watchData.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        </div>

        {/* Right: Info & Comments Panel */}
        <div
          className={`
          w-full md:w-[360px] bg-white flex flex-col overflow-hidden
          fixed md:relative inset-0 md:inset-auto z-50 md:z-auto
          transition-transform duration-300 ease-in-out
          ${
            showComments ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }
        `}
        >
          {/* Mobile Close Button */}
          <div className="md:hidden flex items-center justify-between p-4 bg-white">
            <div className="flex items-center gap-2">
              <Icon icon="fluent:comment-24-filled" className="h-7 w-7" />
              <h2 className="font-bold text-gray-900">Bình luận</h2>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <Icon
                icon="fluent:dismiss-24-filled"
                className="h-6 w-6 text-gray-700"
              />
            </button>
          </div>

          {/* Video Info Section */}
          <div className="p-4">
            <span className="flex items-center mb-3 text-xl font-bold text-blue-600">
              <Icon
                icon="fluent:video-24-filled"
                className="text-blue-600 w-7 h-7 mr-2"
              />
              Watch
            </span>

            {/* Author info */}
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={watchData.user?.avatarImg || avatardf}
                alt={watchData.user?.userProfile?.fullName || watchData.user?.userName}
                className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/home/user/${watchData.user?.userId}`)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-semibold text-gray-800 hover:underline cursor-pointer text-sm"
                      onClick={() =>
                        navigate(`/home/user/${watchData.user?.userId}`)
                      }
                    >
                      {watchData.user?.userProfile?.fullName || watchData.user?.userName}
                    </span>
                    {watchData.location && (
                      <>
                        <span className="text-xs text-gray-600">
                          {" "}
                          đã chia sẻ video tại{" "}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {watchData.location}
                        </span>
                      </>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="4" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="10" cy="16" r="1.5" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>{formatTimeAgo(watchData.createdAt)}</span>
                  <Icon
                    icon="fluent:globe-24-filled"
                    className="w-3 h-3 ml-1"
                  />
                  {watchData.privacy && (
                    <span className="ml-1">
                      • {formatPrivacy(watchData.privacy)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {watchData.title}
            </h2>

            {/* Description */}
            <div className="!text-sm text-gray-700 mb-3 max-h-[200px] overflow-y-auto">
              <ExpandableContent
                content={watchData.description || ""}
                maxLines={3}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Icon icon="fluent:eye-24-regular" className="w-4 h-4" />
                <span>{watchData.viewCount.toLocaleString()} lượt xem</span>
              </div>
            </div>

            {/* Tags */}
            {watchData.tags && watchData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {watchData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 sm:gap-6 pt-3 text-[11px] sm:text-xs text-black">
              <div className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 9l-2-2-2 2m0 6l2 2 2-2"
                  />
                </svg>
              </div>
              <LikeButton
                watchId={watchData.watchId}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
                likeCount={likeCount}
                setLikeCount={setLikeCount}
              />
              <div className="flex items-center gap-1 transition-colors cursor-pointer hover:text-blue-500">
                <Icon
                  icon="fluent:chat-24-filled"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
                <span>Bình luận {commentCount > 0 && `(${commentCount})`}</span>
              </div>
              <div
                className="flex items-center gap-1 transition-colors cursor-pointer hover:text-green-500"
                onClick={handleShareClick}
              >
                <Icon
                  icon="fluent:arrow-reply-24-filled"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
                <span>Chia sẻ {shareCount > 0 && `(${shareCount})`}</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  icon="fluent:comment-multiple-24-filled"
                  className="w-6 h-6 text-blue-600"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Bình luận ({commentCount})
                </h2>
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between mb-4">
                <CommentSortDropdown
                  currentSort={commentSort}
                  onSortChange={(sort) => {
                    setCommentSort(sort);
                    setCommentPage(0);
                    setComments([]);
                    setHasMoreComments(true);
                  }}
                />
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon
                      icon="fluent:comment-24-regular"
                      className="h-12 w-12 mx-auto mb-2 text-gray-400"
                    />
                    <p className="text-sm">Chưa có bình luận nào</p>
                    <p className="text-xs mt-1">
                      Hãy là người đầu tiên bình luận
                    </p>
                  </div>
                ) : (
                  <>
                    {comments.map((comment, idx) => (
                      <div
                        key={comment.commentId || idx}
                        ref={
                          comments.length === idx + 1
                            ? lastCommentElementRef
                            : null
                        }
                      >
                        <NestedComment
                          comment={comment}
                          level={0}
                          maxLevel={2}
                          watchId={watchData.watchId}
                          onReply={() => {}}
                          onCommentCreated={handleCommentCountChange}
                          onCommentDeleted={(deletedId) => {
                            setComments((prev) =>
                              prev.filter(
                                (c) => c.commentId !== deletedId
                              )
                            );
                            handleCommentDeleted();
                          }}
                        />
                      </div>
                    ))}
                    {loadingComments && (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-xs text-gray-500">
                          Đang tải...
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-3 bg-white sticky bottom-0">
            <CommentCreateModal
              watchId={watchData.watchId}
              handleComment={() => {}}
              setNewComment={(comment: CommentResponse) => setNewComment(comment)}
              currentUserAvatar={auth.avatar || avatardf}
              setLoading={setLoadingComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaWatchDetailPage;
