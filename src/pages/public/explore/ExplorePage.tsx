import { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { apiGetFeaturedBlogs, apiGetAllBlogs } from "../../../services/blogService";
import type { Blog } from "../../../types/blog.types";
import avatardf from "../../../assets/images/avatar_default.png";
import { formatDate } from "../../../utilities/helper";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [recentPage, setRecentPage] = useState(0);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const travelTips = [
    {
      title: "Chuẩn bị hành lý thông minh",
      content: "Những món đồ cần thiết cho chuyến du lịch hoàn hảo",
      icon: "fluent:luggage-24-filled",
    },
    {
      title: "Tiết kiệm chi phí du lịch",
      content: "Cách lập kế hoạch du lịch với ngân sách hợp lý",
      icon: "fluent:money-24-filled",
    },
    {
      title: "An toàn khi du lịch",
      content: "Những lưu ý quan trọng để có chuyến đi an toàn",
      icon: "fluent:shield-24-filled",
    },
    {
      title: "Chụp ảnh du lịch đẹp",
      content: "Bí quyết chụp ảnh để có những kỷ niệm tuyệt vời",
      icon: "fluent:camera-24-filled",
    },
  ];

  // Load featured blogs
  const loadFeaturedBlogs = useCallback(async () => {
    try {
      setIsLoadingFeatured(true);
      const response = await apiGetFeaturedBlogs(0, 6);
      setFeaturedBlogs(response.data?.content || []);
    } catch (error) {
      console.error("Error loading featured blogs:", error);
    } finally {
      setIsLoadingFeatured(false);
    }
  }, []);

  // Load recent blogs
  const loadRecentBlogs = useCallback(async (pageNum: number) => {
    try {
      setIsLoadingRecent(true);
      const response = await apiGetAllBlogs(pageNum, 10, "createdAt,desc");
      const newBlogs = response.data?.content || [];
      
      if (pageNum === 0) {
        setRecentBlogs(newBlogs);
      } else {
        setRecentBlogs(prev => [...prev, ...newBlogs]);
      }
      
      setHasMoreRecent(newBlogs.length === 10);
    } catch (error) {
      console.error("Error loading recent blogs:", error);
    } finally {
      setIsLoadingRecent(false);
    }
  }, []);

  // Callback ref for the last blog element (Intersection Observer)
  const lastBlogElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingRecent) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreRecent) {
            setRecentPage((prevPage) => prevPage + 1);
          }
        },
        { 
          rootMargin: '200px'
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [isLoadingRecent, hasMoreRecent]
  );

  // Load initial data
  useEffect(() => {
    loadFeaturedBlogs();
    loadRecentBlogs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more recent blogs when page changes
  useEffect(() => {
    if (recentPage > 0) {
      loadRecentBlogs(recentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentPage]);

  const handleBlogClick = (blogId: string) => {
    navigate(`/home/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:globe-24-filled" className="w-10 h-10 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Khám phá</h1>
              <p className="text-gray-600 text-sm">
                Khám phá những bài viết du lịch nổi bật và mẹo hay từ cộng đồng
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-4 sm:p-6">
          {/* Featured Blogs */}
          {(isLoadingFeatured || featuredBlogs.length > 0) && (
            <div className="mb-12">
              <div className="border-l-4 border-gray-900 pl-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Bài viết nổi bật</h2>
                <p className="text-gray-600 text-sm">
                  Những bài viết được chọn lọc dựa trên rating và lượt xem
                </p>
              </div>
              {isLoadingFeatured ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredBlogs.map((blog) => (
                  <div
                    key={blog.blogId}
                    onClick={() => handleBlogClick(blog.blogId)}
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50"
                  >
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
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
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                        {blog.description || "Khám phá trải nghiệm du lịch thú vị..."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-blue-600 font-medium">
                          Khám phá ngay →
                        </span>
                        {blog.averageRating > 0 && (
                          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-700">
                            <Icon
                              icon="fluent:star-24-filled"
                              className="h-4 w-4 text-yellow-500"
                            />
                            <span className="font-medium">
                              {blog.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {/* Travel Tips */}
          <div className="mb-12">
            <div className="border-l-4 border-gray-900 pl-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mẹo du lịch</h2>
              <p className="text-gray-600 text-sm">
                Những lời khuyên hữu ích cho chuyến du lịch hoàn hảo
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {travelTips.map((tip, index) => (
                <div
                  key={index}
                  onClick={() => navigate('/home/explore/guides')}
                  className="bg-white rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon={tip.icon}
                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Blogs */}
          <div>
            <div className="border-l-4 border-gray-900 pl-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Bài viết mới nhất</h2>
              <p className="text-gray-600 text-sm">
                Khám phá những bài viết du lịch mới được đăng tải
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {recentBlogs.map((blog, index) => (
                <div
                  key={blog.blogId}
                  ref={index === recentBlogs.length - 1 ? lastBlogElementRef : null}
                  onClick={() => handleBlogClick(blog.blogId)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <div className="w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                        {blog.title}
                      </h3>
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
              
              {recentBlogs.length === 0 && !isLoadingRecent && (
                <div className="text-center py-12 text-gray-400">
                  <Icon icon="mdi:file-document-outline" className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có bài viết nào</p>
                </div>
              )}

              {isLoadingRecent && (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
