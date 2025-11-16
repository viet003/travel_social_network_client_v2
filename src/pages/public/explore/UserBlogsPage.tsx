import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TravelButton from "../../../components/ui/customize/TravelButton";
import { LoadingSpinner } from "../../../components/ui/loading";
import { ExpandableContent } from "../../../components/ui";
import { apiGetMyBlogs, apiDeleteBlog } from "../../../services/blogService";
import type { Blog } from "../../../types/blog.types";
import ConfirmDeleteModal from "../../../components/modal/confirm/ConfirmDeleteModal";
import { formatDate } from "../../../utilities/helper";

const UserBlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBlogs = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await apiGetMyBlogs(pageNum, 10);
      const newBlogs = response.data.content;
      
      if (reset) {
        setBlogs(newBlogs);
      } else {
        setBlogs((prev) => [...prev, ...newBlogs]);
      }
      
      setHasMore(newBlogs.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Error loading blogs:", error);
      toast.error("Không thể tải danh sách blog");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadBlogs(page + 1, false);
    }
  }, [page, loadingMore, hasMore, loadBlogs]);

  useEffect(() => {
    loadBlogs(0, true);
  }, [loadBlogs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, isLoading, loadMore]);

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      await apiDeleteBlog(blogToDelete.blogId);
      toast.success("Đã xóa blog thành công");
      setPage(0);
      setHasMore(true);
      loadBlogs(0, true);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Không thể xóa blog");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setBlogToDelete(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Đã xuất bản";
      case "DRAFT":
        return "Bản nháp";
      case "PENDING":
        return "Chờ duyệt";
      case "ARCHIVED":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "text-emerald-700 bg-emerald-50 border-emerald-300";
      case "DRAFT":
        return "text-slate-700 bg-slate-50 border-slate-300";
      case "PENDING":
        return "text-amber-700 bg-amber-50 border-amber-300";
      case "ARCHIVED":
        return "text-rose-700 bg-rose-50 border-rose-300";
      default:
        return "text-slate-700 bg-slate-50 border-slate-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:document-text-24-filled" className="w-10 h-10 text-gray-900" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bài viết của bạn</h1>
              <p className="text-gray-600 text-sm">
                Quản lý và chỉnh sửa các bài viết của bạn
              </p>
            </div>
          </div>
          <TravelButton
            type="primary"
            onClick={() => navigate("/home/blog/create")}
            className="whitespace-nowrap flex-shrink-0"
          >
            <Icon icon="fluent:add-24-filled" className="w-5 h-5 mr-2" />
            Tạo bài viết
          </TravelButton>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-6">
            <Icon
              icon="fluent:document-text-24-regular"
              className="w-12 h-12 text-blue-600"
            />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Bắt đầu chia sẻ câu chuyện của bạn với cộng đồng ngay hôm nay
          </p>
          <TravelButton 
            type="primary" 
            onClick={() => navigate("/home/blog/create")}
          >
            <Icon icon="fluent:add-24-filled" className="w-5 h-5 mr-2" />
            Tạo bài viết đầu tiên
          </TravelButton>
        </div>
      ) : (
        <div className="space-y-5">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                {blog.thumbnailUrl && (
                  <div
                    className="w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 cursor-pointer relative overflow-hidden group"
                    onClick={() => navigate(`/home/blog/${blog.blogId}`)}
                  >
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-xl font-bold text-slate-900 flex-1 cursor-pointer hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                      onClick={() => navigate(`/home/blog/${blog.blogId}`)}
                    >
                      {blog.title}
                    </h3>
                    <span
                      className={`ml-4 px-3 py-1.5 rounded-full text-xs font-semibold border-2 whitespace-nowrap ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {getStatusLabel(blog.status)}
                    </span>
                  </div>

                  {blog.description && (
                    <ExpandableContent 
                      content={blog.description}
                      maxLines={2}
                      className="text-sm text-slate-600 mb-4 leading-relaxed"
                    />
                  )}

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                    <div className="flex items-center space-x-5 text-sm">
                      <div className="flex items-center space-x-1.5 text-slate-600 hover:text-rose-600 transition-colors">
                        <Icon icon="fluent:heart-24-regular" className="w-4 h-4" />
                        <span className="font-medium">{blog.likeCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-600 transition-colors">
                        <Icon icon="fluent:comment-24-regular" className="w-4 h-4" />
                        <span className="font-medium">{blog.reviewCount || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-600 hover:text-purple-600 transition-colors">
                        <Icon icon="fluent:eye-24-regular" className="w-4 h-4" />
                        <span className="font-medium">{blog.viewCount || 0}</span>
                      </div>
                      <div className="h-4 w-px bg-slate-300" />
                      <span className="text-xs text-slate-500 font-medium">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/home/blog/edit/${blog.blogId}`)}
                        className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Icon icon="fluent:edit-24-regular" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(blog)}
                        className="p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Xóa"
                      >
                        <Icon icon="fluent:delete-24-regular" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {!isLoading && hasMore && (
        <div ref={observerTarget} className="py-8 text-center">
          {loadingMore && (
            <div className="flex flex-col items-center space-y-3">
              <LoadingSpinner size={32} />
              <span className="text-sm text-slate-500 font-medium">
                Đang tải thêm bài viết...
              </span>
            </div>
          )}
        </div>
      )}

      {!isLoading && !hasMore && blogs.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full">
            <Icon icon="fluent:checkmark-circle-24-filled" className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-600 font-medium">
              Đã hiển thị tất cả bài viết
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        type="custom"
        itemName={blogToDelete?.title || ""}
        customTitle="Xóa bài viết"
        customWarning="Hành động này sẽ xóa vĩnh viễn bài viết và tất cả bình luận, lượt thích. Bạn không thể hoàn tác hành động này."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UserBlogsPage;