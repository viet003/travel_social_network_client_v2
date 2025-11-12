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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import avatardf from "../../../assets/images/avatar_default.png";
import { apiGetCommentsByPostId } from "../../../services/commentService";
import { apiGetPostById } from "../../../services/postService";
import type { PostResponse } from "../../../types/post.types";
import type { RootState } from "../../../stores/types/storeTypes";
import { formatTimeAgo, formatPrivacy } from "../../../utilities/helper";
import "../../../styles/swiper-custom.css";
import "../../../styles/post-modal.css";

interface Comment {
  id?: string;
  commentId?: string;
  avatarImg?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  content: string;
  createdAt: string;
  replyCount?: number;
  level?: number;
  parentCommentId?: string;
}

const MediaPostDetailPage: React.FC = () => {
  const { postId, mediaId } = useParams<{ postId: string; mediaId: string }>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const [postData, setPostData] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<Comment | null>(null);
  const [commentSort, setCommentSort] = useState<SortOption>("most_relevant");

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [shareCount, setShareCount] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchPostByPostId = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        // Fetch post by postId
        const response = await apiGetPostById(postId);
        const post = response.data;

        setPostData(post);
        setIsLiked(post.liked);
        setLikeCount(post.likeCount);
        setCommentCount(post.commentCount);
        setShareCount(post.shareCount);

        // Find the index of the media to focus on
        const mediaIndex = post.mediaList.findIndex(
          (m) => m.mediaId === mediaId
        );
        setCurrentMediaIndex(mediaIndex >= 0 ? mediaIndex : 0);
      } catch (error) {
        console.error("Error fetching post:", error);
        message.error("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchPostByPostId();
  }, [postId, mediaId]);

  const fetchComments = useCallback(
    async (pageNum: number) => {
      if (!postData?.postId) return;

      setLoadingComments(true);
      try {
        const commentResponse = await apiGetCommentsByPostId(
          postData.postId,
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
    [postData?.postId, commentSort]
  );

  useEffect(() => {
    if (postData?.postId && hasMoreComments) {
      fetchComments(commentPage);
    }
  }, [commentPage, postData?.postId, hasMoreComments, fetchComments]);

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

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentMediaIndex(swiper.activeIndex);
  };

  const handleCommentCountChange = () => {
    setCommentCount((prev) => prev + 1);
  };

  const handleCommentDeleted = () => {
    setCommentCount((prev) => Math.max(0, prev - 1));
  };

  const handleShareClick = () => {
    message.info("Chức năng chia sẻ đang được phát triển");
  };

  // Render header text based on postType
  const renderHeaderText = () => {
    if (postData?.postType === "AVATAR_UPDATE") {
      return <span className="text-xs text-gray-600">{postData.content}</span>;
    }

    if (postData?.postType === "COVER_UPDATE") {
      return <span className="text-xs text-gray-600">{postData.content}</span>;
    }

    // NORMAL post with location
    if (postData?.location) {
      return (
        <>
          <span className="text-xs text-gray-600">
            {" "}
            đã chia sẻ khoảnh khắc tại{" "}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {postData.location}
          </span>
        </>
      );
    }

    return null;
  };

  const renderSingleImage = (img: string, index: number) => (
    <div
      key={index}
      className="w-full h-[calc(100vh-112px)] flex items-center justify-center bg-black"
    >
      <img
        src={img}
        alt="post media"
        className="w-full h-full object-cover cursor-pointer"
      />
    </div>
  );

  const renderVideo = (videoUrl: string) => (
    <div className="w-full h-[calc(100vh-112px)] flex items-center justify-center bg-black">
      <video src={videoUrl} controls className="w-full h-full object-cover">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  );

  const renderImageSlider = () => {
    if (!postData?.mediaList || postData.mediaList.length === 0) return null;

    // Separate images and videos
    const imageMedia = postData.mediaList.filter(
      (media) => media.type === "IMAGE"
    );
    const videoMedia = postData.mediaList.filter(
      (media) => media.type === "VIDEO"
    );

    // If only one image, render single image
    if (imageMedia.length === 1 && videoMedia.length === 0) {
      return renderSingleImage(imageMedia[0].url, 0);
    }

    // If only one video, render single video
    if (videoMedia.length === 1 && imageMedia.length === 0) {
      return renderVideo(videoMedia[0].url);
    }

    // Multiple media - use Swiper
    return (
      <div className="relative w-full h-[calc(100vh-112px)]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          navigation={false}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop={false}
          initialSlide={currentMediaIndex}
          onSlideChange={handleSlideChange}
          className="post-swiper w-full h-full"
        >
          {postData.mediaList.map((media, index) => (
            <SwiperSlide key={media.mediaId || index} className="w-full h-full">
              <div className="w-full h-full flex items-center justify-center bg-black">
                {media.type === "VIDEO" ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                ) : (
                  <img
                    src={media.url}
                    alt={`media-${index}`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {currentMediaIndex > 0 && (
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
          >
            <Icon icon="fluent:chevron-left-20-filled" className="w-5 h-5" />
          </button>
        )}

        {currentMediaIndex < postData.mediaList.length - 1 && (
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute p-2 text-white transition-all duration-200 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-1/2 hover:bg-opacity-70 hover:scale-110 cursor-pointer active:scale-95 z-10"
          >
            <Icon icon="fluent:chevron-right-24-filled" className="w-5 h-5" />
          </button>
        )}

        {/* Image Counter */}
        <div className="absolute px-2 py-1 text-sm text-white bg-black bg-opacity-50 rounded-full bottom-2 right-2 z-10">
          {currentMediaIndex + 1} / {postData.mediaList.length}
        </div>
      </div>
    );
  };

  const renderMedia = () => {
    return renderImageSlider();
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

  if (!postData) {
    return (
      <div className="h-[calc(100vh-56px)] bg-black flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="fluent:error-circle-24-regular"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
          />
          <p className="text-gray-400 mb-4">Không tìm thấy bài viết</p>
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
                  src={postData.user?.avatarImg || avatardf}
                  alt={postData.user?.fullName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() =>
                    navigate(`/home/user/${postData.user?.userId}`)
                  }
                />
                <div>
                  <h2
                    className="font-semibold text-gray-900 hover:underline cursor-pointer text-sm"
                    onClick={() =>
                      navigate(`/home/user/${postData.user?.userId}`)
                    }
                  >
                    {postData.user?.fullName}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{formatTimeAgo(postData.createdAt)}</span>
                    <Icon
                      icon="fluent:globe-24-filled"
                      className="w-3 h-3 ml-1"
                    />
                    {postData.privacy && (
                      <span className="ml-1">
                        • {formatPrivacy(postData.privacy)}
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
        {/* Left: Media Display */}
        <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
          {renderMedia()}
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
          {/* Post Content Section */}
          <div className="p-4">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon
                icon="fluent:compass-northwest-24-regular"
                className="text-blue-600 w-7 h-7"
              />
              TravelNest
            </span>
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={postData.user?.avatarImg || avatardf}
                alt={postData.user?.fullName}
                className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/home/user/${postData.user?.userId}`)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-semibold text-gray-800 hover:underline cursor-pointer text-sm"
                      onClick={() =>
                        navigate(`/home/user/${postData.user?.userId}`)
                      }
                    >
                      {postData.user?.fullName}
                    </span>
                    {renderHeaderText()}
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
                  <span>{formatTimeAgo(postData.createdAt)}</span>
                  <Icon
                    icon="fluent:globe-24-filled"
                    className="w-3 h-3 ml-1"
                  />
                  {postData.privacy && (
                    <span className="ml-1">
                      • {formatPrivacy(postData.privacy)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content - Only show for NORMAL posts */}
            {postData.postType === "NORMAL" && (
              <div className="text-sm text-gray-900 mb-2 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                <ExpandableContent content={postData.content} maxLines={5} />
              </div>
            )}

            {/* Tags */}
            {postData.tags && postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {postData.tags.map((tag, index) => (
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
                postId={postData.postId}
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
          </div>{" "}
          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Icon
                  icon="fluent:comment-multiple-24-filled"
                  className="w-6 h-6 text-blue-600"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Comments ({postData.commentCount})
                </h2>
              </div>
              {/* Sort Options */}
              <div className="flex items-center justify-between mb-4">
                <CommentSortDropdown
                  currentSort={commentSort}
                  onSortChange={(sort) => {
                    setCommentSort(sort);
                    // Reset and refetch comments with new sort
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
                        key={comment.id || comment.commentId || idx}
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
                          postId={postData.postId}
                          onReply={(parentId, content) => {
                            console.log(
                              "Reply to:",
                              parentId,
                              "Content:",
                              content
                            );
                          }}
                          onCommentCreated={handleCommentCountChange}
                          onCommentDeleted={(deletedId) => {
                            setComments((prev) =>
                              prev.filter(
                                (c) => (c.id || c.commentId) !== deletedId
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
              postId={postData.postId}
              handleComment={() => {}}
              setNewComment={(comment: Comment) => setNewComment(comment)}
              currentUserAvatar={auth.avatar || avatardf}
              setLoading={setLoadingComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPostDetailPage;
