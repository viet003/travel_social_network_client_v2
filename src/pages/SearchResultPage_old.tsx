import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { apiGlobalSearch } from '../services/searchService';
import type { UserResponse } from '../types/user.types';
import type { GroupResponse } from '../types/group.types';
import type { PostResponse } from '../types/post.types';
import { UserResultItem, GroupResultItem } from '../components/common/items';
import type { UserResultItemProps } from '../components/common/items/UserResultItem';
import type { GroupResultItemProps } from '../components/common/items/GroupResultItem';
import { avatarDefault } from '../assets/images';
import { path } from '../utilities/path';

interface PostResultItemProps {
    id: string;
    content: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string;
    mediaCount?: number;
}

const SearchResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'groups' | 'posts'>('all');
    const [userResults, setUserResults] = useState<UserResultItemProps[]>([]);
    const [groupResults, setGroupResults] = useState<GroupResultItemProps[]>([]);
    const [postResults, setPostResults] = useState<PostResultItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPage, setUserPage] = useState(0);
    const [groupPage, setGroupPage] = useState(0);
    const [postPage, setPostPage] = useState(0);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [hasMoreGroups, setHasMoreGroups] = useState(true);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const fetchSearchResults = async (loadMore = false) => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const currentUserPage = loadMore && activeTab === 'users' ? userPage + 1 : 0;
            const currentGroupPage = loadMore && activeTab === 'groups' ? groupPage + 1 : 0;

            const response = await apiGlobalSearch(
                query,
                activeTab === 'users' ? currentUserPage : currentGroupPage,
                10
            );

            // Map users
            const users: UserResultItemProps[] = response.data.users.content.map((user: UserResponse) => ({
                id: user.userId || '',
                name: user.userProfile?.fullName || user.userName,
                avatar: user.avatarImg || avatarDefault,
                description: user.friendshipStatus ? 'Bạn bè' : 'Bạn chung'
            }));

            // Map groups
            const groups: GroupResultItemProps[] = response.data.groups.content.map((group: GroupResponse) => ({
                id: group.groupId,
                name: group.groupName,
                avatar: group.coverImageUrl || avatarDefault,
                description: group.privacy ? 'Nhóm riêng tư' : 'Nhóm công khai',
                memberCount: group.memberCount
            }));

            // Map posts
            const posts: PostResultItemProps[] = (response.data.posts?.content || []).map((post: PostResponse) => ({
                id: post.postId,
                content: post.content,
                authorName: post.user?.fullName || 'Unknown',
                authorAvatar: post.user?.avatarImg || avatarDefault,
                createdAt: post.createdAt,
                mediaCount: post.mediaList?.length || 0
            }));

            if (loadMore) {
                if (activeTab === 'users') {
                    setUserResults(prev => [...prev, ...users]);
                    setUserPage(currentUserPage);
                } else if (activeTab === 'groups') {
                    setGroupResults(prev => [...prev, ...groups]);
                    setGroupPage(currentGroupPage);
                } else if (activeTab === 'posts') {
                    setPostResults(prev => [...prev, ...posts]);
                    setPostPage(postPage + 1);
                }
            } else {
                setUserResults(users);
                setGroupResults(groups);
                setPostResults(posts);
                setUserPage(0);
                setGroupPage(0);
                setPostPage(0);
            }

            setHasMoreUsers(response.data.users.totalPages > currentUserPage + 1);
            setHasMoreGroups(response.data.groups.totalPages > currentGroupPage + 1);
            setHasMorePosts(response.data.posts?.totalPages ? response.data.posts.totalPages > (loadMore && activeTab === 'posts' ? postPage + 1 : 0) : false);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (query.trim()) {
            fetchSearchResults();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const handleLoadMore = () => {
        fetchSearchResults(true);
    };

    const filteredResults = () => {
        switch (activeTab) {
            case 'users': return { users: userResults, groups: [], posts: [] };
            case 'groups': return { users: [], groups: groupResults, posts: [] };
            case 'posts': return { users: [], groups: [], posts: postResults };
            default: return { users: userResults, groups: groupResults, posts: postResults };
        }
    };

    const results = filteredResults();
    const totalResults = activeTab === 'all' 
        ? userResults.length + groupResults.length + postResults.length
        : activeTab === 'users' ? userResults.length 
        : activeTab === 'groups' ? groupResults.length 
        : postResults.length;

    // Component nhỏ cho Tab Button để code gọn hơn
    const TabButton = ({ id, label, icon, count }: { id: typeof activeTab, label: string, icon: string, count: number }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === id
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
        >
            <Icon icon={icon} className={`w-4 h-4 ${activeTab === id ? 'text-blue-600' : ''}`} />
            {label}
            {count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === id ? 'bg-gray-100 text-gray-900' : 'bg-gray-200/50 text-gray-500'
                }`}>
                    {count}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* Header: Clean & Sticky */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 cursor-pointer"
                        >
                            <Icon icon="fluent:arrow-left-24-regular" className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Kết quả cho "{query}"
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Tìm thấy {totalResults} kết quả
                            </p>
                        </div>
                    </div>

                    {/* Modern Segmented Control Tabs */}
                    <div className="mt-6 p-1 bg-gray-100/80 rounded-2xl flex gap-1">
                        <TabButton id="all" label="Tất cả" icon="fluent:grid-24-regular" count={0} />
                        <TabButton id="users" label="Mọi người" icon="fluent:people-24-regular" count={userResults.length} />
                        <TabButton id="groups" label="Nhóm" icon="fluent:people-community-24-regular" count={groupResults.length} />
                        <TabButton id="posts" label="Bài viết" icon="fluent:document-text-24-regular" count={postResults.length} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {isLoading && !userResults.length && !groupResults.length ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-10 animate-fade-in-up">
                        
                        {/* Users Section */}
                        {results.users.length > 0 && (
                            <section>
                                {activeTab === 'all' && (
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <h2 className="text-lg font-bold text-gray-900">Mọi người</h2>
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {results.users.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer"
                                            onClick={() => navigate(`${path.HOME}/${path.USER.replace(':userId', user.id)}`)}
                                        >
                                            {/* Giả sử UserResultItem được styling tốt bên trong, 
                                                hoặc bọc nó để đảm bảo layout */}
                                            <UserResultItem {...user} /> 
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Groups Section */}
                        {results.groups.length > 0 && (
                            <section>
                                {activeTab === 'all' && (
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <h2 className="text-lg font-bold text-gray-900">Nhóm & Cộng đồng</h2>
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {results.groups.map((group) => (
                                        <div 
                                            key={group.id} 
                                            className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200 cursor-pointer"
                                            onClick={() => navigate(`${path.HOME}/${path.GROUPS}/${path.GROUP_DETAIL.replace(':groupId', group.id)}`)}
                                        >
                                            <GroupResultItem {...group} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Posts Section */}
                        {results.posts.length > 0 && (
                            <section>
                                {activeTab === 'all' && (
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <h2 className="text-lg font-bold text-gray-900">Bài viết</h2>
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {results.posts.map((post) => (
                                        <div 
                                            key={post.id} 
                                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 cursor-pointer"
                                            onClick={() => navigate(`${path.HOME}/${path.POST_DETAIL.replace(':postId', post.id)}`)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <img 
                                                    src={post.authorAvatar} 
                                                    alt={post.authorName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    onError={(e) => { e.currentTarget.src = avatarDefault; }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 text-sm">{post.authorName}</h3>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 line-clamp-2">
                                                        {post.content}
                                                    </p>
                                                    {post.mediaCount && post.mediaCount > 0 && (
                                                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                                            <Icon icon="fluent:image-24-regular" className="w-4 h-4" />
                                                            <span>{post.mediaCount} ảnh</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty State */}
                        {!isLoading && totalResults === 0 && (
                            <div className="text-center py-16 px-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon icon="fluent:search-24-regular" className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả nào</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    Chúng tôi không tìm thấy kết quả phù hợp cho "<span className="text-gray-900 font-medium">{query}</span>". Hãy thử kiểm tra lỗi chính tả hoặc dùng từ khóa khác.
                                </p>
                            </div>
                        )}

                        {/* Load More Button */}
                        {((activeTab === 'users' && hasMoreUsers) ||
                          (activeTab === 'groups' && hasMoreGroups) ||
                          (activeTab === 'posts' && hasMorePosts) ||
                          (activeTab === 'all' && (hasMoreUsers || hasMoreGroups || hasMorePosts))) && (
                            <div className="flex justify-center pt-4 pb-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Icon icon="eos-icons:loading" className="w-4 h-4" /> Đang tải...
                                        </span>
                                    ) : 'Xem thêm kết quả'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;