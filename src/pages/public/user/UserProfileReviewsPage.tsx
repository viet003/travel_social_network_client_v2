import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react';

// Types
interface Review {
  reviewId: string;
  locationName: string;
  locationImage: string;
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
}

const UserProfileReviewsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockReviews: Review[] = Array.from({ length: 4 }, (_, i) => ({
        reviewId: `review-${i}`,
        locationName: `Địa điểm ${i + 1}`,
        locationImage: "/placeholder.svg?height=200&width=300",
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        content: `Đây là một địa điểm tuyệt vời! Tôi đã có những trải nghiệm đáng nhớ tại đây. Phong cảnh đẹp, con người thân thiện.`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        images: Array.from({ length: Math.floor(Math.random() * 4) }, (_, j) => 
          `/placeholder.svg?height=150&width=150&text=Image${j + 1}`
        ),
      }));
      setReviews(mockReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchReviews();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "Hôm nay";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6 sm:py-8">
        <div className="text-sm sm:text-base text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 sm:py-12 text-center">
        <Icon icon="lucide:message-square" width={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
        <p className="text-sm sm:text-base text-gray-500">Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {reviews.map((review) => (
        <div
          key={review.reviewId}
          className="p-4 sm:p-5 lg:p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          {/* Location info */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <img
              src={review.locationImage}
              alt={review.locationName}
              className="object-cover w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 text-base sm:text-lg font-semibold text-gray-800 truncate">
                {review.locationName}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1">
                <div className="flex gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon
                      key={i}
                      icon={i < review.rating ? "lucide:star" : "lucide:star"}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Review content */}
          <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-700 line-clamp-3">{review.content}</p>

          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="object-cover w-full h-20 sm:h-24 rounded-lg cursor-pointer hover:opacity-90"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfileReviewsPage;
