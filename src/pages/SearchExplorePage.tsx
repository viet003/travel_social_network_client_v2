import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { apiSearchBlogs } from '../services/searchService';
import type { Blog } from '../types/blog.types';
import { path } from '../utilities/path';

interface BlogResultItemProps {
    id: string;
    title: string;
    thumbnail?: string;
    description?: string;
    author: string;
    authorAvatar?: string;
    viewCount: number;
    averageRating: number;
    location?: string;
    createdAt: string;
    readingTime?: number;
}

const SearchExplorePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    
    const [blogResults, setBlogResults] = useState<BlogResultItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Fetch initial results
    const fetchInitialResults = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await apiSearchBlogs(query, 0, 12);

            // Map blogs
            const blogs: BlogResultItemProps[] = response.data.content.map((blog: Blog) => ({
                id: blog.blogId,
                title: blog.title,
                thumbnail: blog.thumbnailUrl,
                description: blog.description,
                author: blog.author.userName,
                authorAvatar: blog.author.avatarImg,
                viewCount: blog.viewCount,
                averageRating: blog.averageRating,
                location: blog.location,
                createdAt: blog.createdAt,
                readingTime: blog.readingTime
            }));

            setBlogResults(blogs);
            setHasMore(!response.data.last);
            setPage(0);
        } catch (error) {
            console.error('Error fetching blog search results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (query.trim()) {
            fetchInitialResults();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    // Load more blogs
    const loadMoreBlogs = async () => {
        if (!hasMore || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const response = await apiSearchBlogs(query, nextPage, 12);

            const newBlogs: BlogResultItemProps[] = response.data.content.map((blog: Blog) => ({
                id: blog.blogId,
                title: blog.title,
                thumbnail: blog.thumbnailUrl,
                description: blog.description,
                author: blog.author.userName,
                authorAvatar: blog.author.avatarImg,
                viewCount: blog.viewCount,
                averageRating: blog.averageRating,
                location: blog.location,
                createdAt: blog.createdAt,
                readingTime: blog.readingTime
            }));

            setBlogResults(prev => [...prev, ...newBlogs]);
            setPage(nextPage);
            setHasMore(!response.data.last);
        } catch (error) {
            console.error('Error loading more blogs:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            {/* Header: Clean & Sticky */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 cursor-pointer"
                        >
                            <Icon icon="fluent:arrow-left-24-regular" className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">
                                Tìm kiếm bài viết: "{query}"
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${blogResults.length} bài viết`}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(path.HOME + '/' + path.EXPLORE)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Quay về khám phá
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 text-sm">Đang tìm kiếm bài viết...</p>
                    </div>
                ) : (
                    <>
                        {/* Blog Results Grid */}
                        {blogResults.length > 0 ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogResults.map((blog) => (
                                        <div
                                            key={blog.id}
                                            onClick={() => navigate(`${path.HOME}/${path.EXPLORE}/blog/${blog.id}`)}
                                            className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                                                {blog.thumbnail ? (
                                                    <img
                                                        src={blog.thumbnail}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Icon icon="fluent:book-24-filled" className="w-16 h-16 text-blue-400" />
                                                    </div>
                                                )}
                                                {/* Reading Time Badge */}
                                                {blog.readingTime && (
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                        <span className="text-white text-xs font-medium flex items-center gap-1">
                                                            <Icon icon="fluent:clock-24-regular" className="w-3 h-3" />
                                                            {blog.readingTime} phút đọc
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                {/* Title */}
                                                <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {blog.title}
                                                </h3>

                                                {/* Description */}
                                                {blog.description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {truncateText(blog.description, 100)}
                                                    </p>
                                                )}

                                                {/* Meta Info */}
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Icon icon="fluent:eye-24-regular" className="w-3.5 h-3.5" />
                                                        {blog.viewCount.toLocaleString()}
                                                    </span>
                                                    {blog.averageRating > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="fluent:star-24-filled" className="w-3.5 h-3.5 text-yellow-500" />
                                                            {blog.averageRating.toFixed(1)}
                                                        </span>
                                                    )}
                                                    {blog.location && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon icon="fluent:location-24-regular" className="w-3.5 h-3.5" />
                                                            {truncateText(blog.location, 15)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Author & Date */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        {blog.authorAvatar ? (
                                                            <img
                                                                src={blog.authorAvatar}
                                                                alt={blog.author}
                                                                className="w-6 h-6 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <Icon icon="fluent:person-24-regular" className="w-3 h-3 text-blue-600" />
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-medium text-gray-700">
                                                            {blog.author}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(blog.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-8">
                                        <button
                                            onClick={loadMoreBlogs}
                                            disabled={isLoadingMore}
                                            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                                        >
                                            {isLoadingMore ? (
                                                <span className="flex items-center gap-2">
                                                    <Icon icon="eos-icons:loading" className="w-5 h-5" /> Đang tải...
                                                </span>
                                            ) : 'Xem thêm bài viết'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20 px-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon icon="fluent:book-search-24-regular" className="w-12 h-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết nào</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    Chúng tôi không tìm thấy bài viết phù hợp cho "<span className="text-gray-900 font-semibold">{query}</span>". Hãy thử tìm kiếm với từ khóa khác.
                                </p>
                                <button
                                    onClick={() => navigate(path.HOME + '/' + path.EXPLORE)}
                                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Khám phá tất cả bài viết
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchExplorePage;
