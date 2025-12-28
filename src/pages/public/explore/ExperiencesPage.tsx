import { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { apiGetAllBlogs } from "../../../services/blogService";
import type { Blog } from "../../../types/blog.types";
import avatardf from "../../../assets/images/avatar_default.png";
import { formatDate } from "../../../utilities/helper";

const ExperiencesPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadBlogs = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true);
      // Sort by: averageRating DESC, totalRatings DESC, createdAt DESC
      const response = await apiGetAllBlogs(pageNum, 10, "averageRating,desc;totalRatings,desc;createdAt,desc");
      const newBlogs = response.data?.content || [];
      
      if (pageNum === 0) {
        setBlogs(newBlogs);
      } else {
        setBlogs(prev => [...prev, ...newBlogs]);
      }
      
      setHasMore(newBlogs.length === 10);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Callback ref for the last blog element (Intersection Observer)
  const lastBlogElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {            setPage((prevPage) => prevPage + 1);
          }
        },
        { 
          rootMargin: '200px' // Load before reaching the bottom
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Load initial blogs
  useEffect(() => {
    loadBlogs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more blogs when page changes
  useEffect(() => {
    if (page > 0) {
      loadBlogs(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/home/blog/${blogId}`);
  };

  if (isLoading && blogs.length === 0) {
    return (
      <div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Icon icon="fluent:star-24-filled" className="w-10 h-10 text-gray-900" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trải nghiệm & Review</h1>
            <p className="text-gray-600 text-sm">
              Đánh giá và trải nghiệm du lịch từ cộng đồng
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {blogs.map((blog, index) => (
          <div
            key={blog.blogId}
            ref={index === blogs.length - 1 ? lastBlogElementRef : null}
            onClick={() => handleBlogClick(blog.blogId)}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image Section */}
              <div 
                className="w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden"
              >
                {blog.thumbnailUrl ? (
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="mdi:image-outline" className="w-16 h-16 text-white opacity-50" />
                )}
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                    {blog.title}
                  </h3>
                  {blog.averageRating > 0 && (
                    <div className="flex items-center space-x-1 ml-3 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Icon
                        icon="fluent:star-24-filled"
                        className="h-4 w-4 text-yellow-500"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        {blog.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {blog.description || "Khám phá trải nghiệm du lịch thú vị..."}
                </p>
                
                {/* Author and Stats */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                      src={blog.author?.avatarImg || avatardf}
                      alt={blog.author?.userName}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {blog.author?.userName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Icon
                        icon="mdi:eye"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
                      />
                      <span className="text-xs sm:text-sm font-medium">
                        {blog.viewCount || 0}
                      </span>
                    </div>
                    {blog.totalRatings > 0 && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Icon
                          icon="mdi:star"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          {blog.totalRatings} đánh giá
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {blogs.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-400">
            <Icon icon="mdi:file-document-outline" className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p>Chưa có bài viết nào</p>
          </div>
        )}

        {hasMore && blogs.length > 0 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                  <span>Xem thêm</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;
