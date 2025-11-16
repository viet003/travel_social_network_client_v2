import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import { apiGetReviewsByUserId } from "../../../services/blogReviewService";
import { formatDate } from "../../../utilities/helper";
import avatardf from "../../../assets/images/avatar_default.png";

// Types
interface Review {
  reviewId: string;
  blogId: string;
  blogTitle: string;
  blogThumbnailUrl: string;
  rating: number;
  content: string;
  createdAt: string;
  isEdited: boolean;
  blogAuthor: {
    userId: string;
    userName: string;
    avatarImg?: string;
  };
  user: {
    userId: string;
    userName: string;
    avatarImg?: string;
  };
}

const UserProfileReviewsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch user reviews
  const fetchReviews = useCallback(async (pageNum: number) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await apiGetReviewsByUserId(userId, pageNum, 10);
      const newReviews = (response.data?.content || []) as Review[];
      
      if (pageNum === 0) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      
      setHasMore(newReviews.length === 10);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Callback ref for the last review element (Intersection Observer)
  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { 
          rootMargin: '200px'
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchReviews(0);
  }, [fetchReviews]);

  useEffect(() => {
    if (page > 0) {
      fetchReviews(page);
    }
  }, [page, fetchReviews]);

  const handleBlogClick = (blogId: string) => {
    navigate(`/home/blog/${blogId}`);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0 && !loading) {
    return (
      <div className="py-8 sm:py-12 text-center">
        <Icon icon="fluent:star-24-filled" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
        <p className="text-sm sm:text-base text-gray-500">Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {reviews.map((review, index) => (
        <div
          key={review.reviewId}
          ref={index === reviews.length - 1 ? lastReviewElementRef : null}
          onClick={() => handleBlogClick(review.blogId)}
          className="group bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:bg-gray-100"
        >
          {/* Header: Reviewer Info & Rating */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={review.user.avatarImg || avatardf}
                alt={review.user.userName}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-3 border-white shadow-md"
              />
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {review.user.userName} <span className="font-normal text-xs text-gray-500">đã đánh giá bài viết</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                  {review.isEdited && <span className="text-orange-500"> • Đã chỉnh sửa</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full shadow-sm">
              <Icon icon="fluent:star-24-filled" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-sm sm:text-base font-bold text-white">{review.rating}.0</span>
            </div>
          </div>

          {/* Review Content */}
          <div className="p-4 sm:p-5">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-3 mb-4">
              {review.content}
            </p>

            {/* Blog Card */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex-shrink-0 overflow-hidden shadow-md">
                {review.blogThumbnailUrl ? (
                  <img
                    src={review.blogThumbnailUrl}
                    alt={review.blogTitle}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Icon icon="mdi:image-outline" className="w-full h-full text-white opacity-50 p-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium mb-1">Đánh giá cho</p>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                  {review.blogTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <img
                    src={review.blogAuthor.avatarImg || avatardf}
                    alt={review.blogAuthor.userName}
                    className="w-5 h-5 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-xs text-gray-600">bởi <span className="font-medium">{review.blogAuthor.userName}</span></span>
                </div>
              </div>
              <Icon 
                icon="fluent:chevron-right-24-filled" 
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" 
              />
            </div>
          </div>
        </div>
      ))}
      
      {loading && reviews.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default UserProfileReviewsPage;
