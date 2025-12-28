import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../../../components/ui/loading";
import { apiGetBlogById } from "../../../services/blogService";
import { apiGetReviewsByBlogId } from "../../../services/blogReviewService";
import {
  BlogReviewCreateModal,
  BlogReviewItem,
  BlogReviewSortDropdown,
  type SortOption,
} from "../../../components/modal/blogreview";
import type { Blog } from "../../../types/blog.types";

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

interface AuthState {
  userId: string | null;
  avatar: string | null;
}

const BlogDetailPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: { auth: AuthState }) => state.auth);
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('most_relevant');
  const [hasReviewedLocal, setHasReviewedLocal] = useState(false);

  const loadBlogData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiGetBlogById(id);
      setBlog(response.data);
    } catch (error) {
      console.error("Error loading blog:", error);
      toast.error("Không thể tải bài viết");
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const loadComments = useCallback(async (page: number = 0, sort: SortOption = 'most_relevant') => {
    if (!blogId) return;
    
    setCommentsLoading(true);
    try {
      const response = await apiGetReviewsByBlogId(blogId, page, sort);
      const newComments = (response.data?.content || []) as BlogComment[];
      
      if (page === 0) {
        setComments(newComments);
      } else {
        setComments(prev => [...prev, ...newComments]);
      }
      
      setHasMoreComments(newComments.length > 0);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (blogId) {
      loadBlogData(blogId);
      loadComments(0, sortOption);
    }
  }, [blogId, loadBlogData, sortOption, loadComments]);

  useEffect(() => {
    if (blog?.hasReviewed) {
      setHasReviewedLocal(true);
    }
  }, [blog?.hasReviewed]);

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setCurrentPage(0);
  };

  const handleCommentCreated = () => {
    // Reload comments to get updated data from server
    // Note: handleNewComment already updates the blog state
    loadComments(0, sortOption);
  };

  const handleNewComment = (comment: BlogComment) => {
    setComments(prev => [comment, ...prev]);
    
    if (blog) {
      // All comments are now reviews with required ratings
      if (comment.rating !== undefined && comment.rating > 0) {
        setHasReviewedLocal(true);
        
        // Calculate new average rating
        const currentTotal = (blog.averageRating || 0) * (blog.totalRatings || 0);
        const newTotal = currentTotal + comment.rating;
        const newTotalRatings = (blog.totalRatings || 0) + 1;
        const newAverageRating = newTotal / newTotalRatings;
        
        setBlog({ 
          ...blog, 
          hasReviewed: true,
          averageRating: newAverageRating,
          totalRatings: newTotalRatings
        });
      }
    }
  };

  const handleScroll = useCallback(() => {
    if (commentsLoading || !hasMoreComments) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.offsetHeight - 200;

    if (scrollPosition >= bottomPosition) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadComments(nextPage, sortOption);
    }
  }, [commentsLoading, hasMoreComments, currentPage, sortOption, loadComments]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCommentDeleted = (commentId: string) => {
    const deletedComment = comments.find(c => c.commentId === commentId);
    setComments(prev => prev.filter(c => c.commentId !== commentId));
    
    // If deleted comment was a review, allow user to review again
    if (deletedComment && deletedComment.rating !== undefined && deletedComment.rating > 0) {
      setHasReviewedLocal(false);    }
    
    if (blog && deletedComment?.rating !== undefined && deletedComment.rating > 0) {
      // Recalculate average rating after deletion
      const currentTotal = (blog.averageRating || 0) * (blog.totalRatings || 0);
      const newTotal = Math.max(0, currentTotal - deletedComment.rating);
      const newTotalRatings = Math.max(0, (blog.totalRatings || 0) - 1);
      
      const updatedBlog = { 
        ...blog,
        hasReviewed: false,
        totalRatings: newTotalRatings,
        averageRating: newTotalRatings > 0 ? newTotal / newTotalRatings : 0
      };
      
      setBlog(updatedBlog);
    }
  };

  const handleCommentUpdated = (commentId: string, newContent: string) => {
    setComments(prev =>
      prev.map(c =>
        c.commentId === commentId
          ? { ...c, content: newContent, isEdited: true }
          : c
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon icon="fluent:document-error-24-regular" className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with thumbnail */}
      {blog.thumbnailUrl && (
        <div className="w-full h-64 sm:h-80 md:h-96 relative bg-gray-900">
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate("/home/explore")}
            className="hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </button>
          {" / "}
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Blog</span>
          {" / "}
          <span className="text-gray-700">Bài viết</span>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-lg p-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 pb-6">
            <div className="flex items-center gap-2">
              <img
                src={blog.author?.avatarImg || "https://via.placeholder.com/40"}
                alt={blog.author?.userName || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold text-gray-900">{blog.author?.userName || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar" className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:eye" className="w-4 h-4" />
              <span>{blog.viewCount || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Icon icon="mdi:share-variant" className="w-5 h-5" />
              <span>Chia sẻ</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Icon icon="mdi:bookmark-outline" className="w-5 h-5" />
              <span>Lưu bài viết</span>
            </button>
          </div>

          {/* Warning banner if outdated */}
          {blog.createdAt && new Date().getTime() - new Date(blog.createdAt).getTime() > 63072000000 && (
            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
              <div className="flex items-start gap-3">
                <Icon icon="fluent:warning-24-filled" className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800">
                  Bài đăng này đã không được cập nhật trong 2 năm
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {blog.description && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-gray-700">{blog.description}</p>
            </div>
          )}

          {/* Main content */}
          <style dangerouslySetInnerHTML={{ __html: `
            .blog-content img {
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .blog-content p {
              text-align: justify !important;
            }
          `}} />
          <div
            className="blog-content prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Reading time and location */}
          {(blog.readingTime || blog.location) && (
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {blog.readingTime && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:clock-outline" className="w-5 h-5" />
                  <span>{blog.readingTime} phút đọc</span>
                </div>
              )}
              {blog.location && (
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:map-marker" className="w-5 h-5" />
                  <span>{blog.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Tags:</span>
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon icon="mdi:comment-outline" className="w-5 h-5" />
                Đánh giá ({blog.totalRatings || 0})
              </h3>
              {blog.averageRating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Icon icon="mdi:star" className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">
                    {blog.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({blog.totalRatings || 0} đánh giá)
                  </span>
                </div>
              )}
            </div>
            
            {currentUser.userId && !hasReviewedLocal && (
              <BlogReviewCreateModal
                blogId={blog.blogId}
                currentUserAvatar={currentUser.avatar || ''}
                onCommentCreated={handleCommentCreated}
                onNewComment={handleNewComment}
              />
            )}
            
            {currentUser.userId && hasReviewedLocal && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-800">
                  <Icon icon="mdi:information" className="inline-block w-4 h-4 mr-2" />
                  Bạn đã đánh giá bài viết này rồi. Bạn chỉ có thể đánh giá một lần.
                </p>
              </div>
            )}

            <div className="mt-6 mb-4">
              <BlogReviewSortDropdown
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </div>

            {commentsLoading && comments.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <BlogReviewItem
                      key={comment.commentId}
                      comment={comment}
                      onCommentDeleted={handleCommentDeleted}
                      onCommentUpdated={handleCommentUpdated}
                    />
                  ))}
                </div>

                {commentsLoading && comments.length > 0 && (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                  </div>
                )}

                {comments.length === 0 && !commentsLoading && (
                  <div className="text-center py-12 text-gray-400">
                    <Icon icon="mdi:comment-outline" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage;
