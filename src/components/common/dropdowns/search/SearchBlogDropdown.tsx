import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { apiSearchBlogs } from '../../../../services/searchService';
import type { Blog } from '../../../../types/blog.types';
import { path } from '../../../../utilities/path';

interface BlogResultItemProps {
  id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  author: string;
  viewCount: number;
  averageRating: number;
  location?: string;
}

interface SearchBlogDropdownProps {
  searchQuery: string;
  onClose: () => void;
}

const SearchBlogDropdown: React.FC<SearchBlogDropdownProps> = ({
  searchQuery,
  onClose
}) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<BlogResultItemProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiSearchBlogs(query, 0, 5);
      if (response.success && response.data) {
        const blogs = response.data.content.map((blog: Blog) => ({
          id: blog.blogId,
          title: blog.title,
          thumbnail: blog.thumbnailUrl,
          description: blog.description,
          author: blog.author.userName,
          viewCount: blog.viewCount,
          averageRating: blog.averageRating,
          location: blog.location
        }));
        setSearchResults(blogs);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchBlogs]);

  const handleItemClick = (item: BlogResultItemProps) => {
    navigate(`${path.HOME}/${path.EXPLORE}/blog/${item.id}`);
    onClose();
  };

  const handleViewAll = () => {
    navigate(`${path.HOME}/${path.EXPLORE_SEARCH}?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <Icon icon="line-md:loading-loop" className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Đang tìm kiếm...</p>
        </div>
      )}

      {/* Search Results List */}
      {!loading && searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between p-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">Kết quả tìm kiếm</h3>
            <button
              onClick={handleViewAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {searchResults.map((blog) => (
              <div
                key={blog.id}
                onClick={() => handleItemClick(blog)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Thumbnail */}
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                    <Icon icon="fluent:book-24-filled" className="h-8 w-8 text-blue-600" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {blog.title}
                  </h4>
                  {blog.description && (
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                      {truncateText(blog.description, 80)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon icon="fluent:person-24-regular" className="h-3 w-3" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="fluent:eye-24-regular" className="h-3 w-3" />
                      {blog.viewCount}
                    </span>
                    {blog.averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Icon icon="fluent:star-24-filled" className="h-3 w-3 text-yellow-500" />
                        {blog.averageRating.toFixed(1)}
                      </span>
                    )}
                    {blog.location && (
                      <span className="flex items-center gap-1">
                        <Icon icon="fluent:location-24-regular" className="h-3 w-3" />
                        {truncateText(blog.location, 20)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8">
          <Icon icon="fluent:book-24-regular" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Không tìm thấy bài viết</p>
          <p className="text-gray-400 text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
};

export default SearchBlogDropdown;
