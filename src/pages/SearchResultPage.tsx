import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { apiGlobalSearch } from '../services/searchService';
import type { UserResponse } from '../types/user.types';
import type { GroupResponse } from '../types/group.types';
import { UserResultItem, GroupResultItem } from '../components/common/items';
import type { UserResultItemProps } from '../components/common/items/UserResultItem';
import type { GroupResultItemProps } from '../components/common/items/GroupResultItem';

const SearchResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'groups'>('all');
    const [userResults, setUserResults] = useState<UserResultItemProps[]>([]);
    const [groupResults, setGroupResults] = useState<GroupResultItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPage, setUserPage] = useState(0);
    const [groupPage, setGroupPage] = useState(0);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [hasMoreGroups, setHasMoreGroups] = useState(true);

    useEffect(() => {
        if (query.trim()) {
            fetchSearchResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

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
                avatar: user.avatarImg || 'https://via.placeholder.com/40',
                description: user.friendshipStatus ? 'Bạn bè' : 'Bạn chung'
            }));

            // Map groups
            const groups: GroupResultItemProps[] = response.data.groups.content.map((group: GroupResponse) => ({
                id: group.groupId,
                name: group.groupName,
                avatar: group.coverImageUrl || 'https://via.placeholder.com/40',
                description: group.privacy === 'PUBLIC' ? 'Nhóm công khai' : 'Nhóm riêng tư',
                memberCount: group.memberCount
            }));

            if (loadMore) {
                if (activeTab === 'users') {
                    setUserResults(prev => [...prev, ...users]);
                    setUserPage(currentUserPage);
                } else if (activeTab === 'groups') {
                    setGroupResults(prev => [...prev, ...groups]);
                    setGroupPage(currentGroupPage);
                }
            } else {
                setUserResults(users);
                setGroupResults(groups);
                setUserPage(0);
                setGroupPage(0);
            }

            setHasMoreUsers(response.data.users.totalPages > currentUserPage + 1);
            setHasMoreGroups(response.data.groups.totalPages > currentGroupPage + 1);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        fetchSearchResults(true);
    };

    const filteredResults = () => {
        switch (activeTab) {
            case 'users':
                return { users: userResults, groups: [] };
            case 'groups':
                return { users: [], groups: groupResults };
            default:
                return { users: userResults, groups: groupResults };
        }
    };

    const results = filteredResults();
    const totalResults = (activeTab === 'all' ? userResults.length + groupResults.length : 
                          activeTab === 'users' ? userResults.length : groupResults.length);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Icon icon="fluent:arrow-left-24-filled" className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold">Kết quả tìm kiếm cho "{query}"</h1>
                            <p className="text-sm text-gray-600">{totalResults} kết quả</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                activeTab === 'users'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Người dùng ({userResults.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                activeTab === 'groups'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Nhóm ({groupResults.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {isLoading && !userResults.length && !groupResults.length ? (
                    <div className="flex justify-center items-center py-12">
                        <Icon icon="eos-icons:loading" className="w-10 h-10 text-blue-500" />
                    </div>
                ) : (
                    <>
                        {/* Users Section */}
                        {results.users.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                                <h2 className="text-lg font-semibold mb-4">Người dùng</h2>
                                <div className="space-y-2">
                                    {results.users.map((user) => (
                                        <UserResultItem
                                            key={user.id}
                                            {...user}
                                            onClick={() => navigate(`/profile/${user.id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Groups Section */}
                        {results.groups.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
                                <h2 className="text-lg font-semibold mb-4">Nhóm</h2>
                                <div className="space-y-2">
                                    {results.groups.map((group) => (
                                        <GroupResultItem
                                            key={group.id}
                                            {...group}
                                            onClick={() => navigate(`/groups/${group.id}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {((activeTab === 'users' && hasMoreUsers) ||
                          (activeTab === 'groups' && hasMoreGroups) ||
                          (activeTab === 'all' && (hasMoreUsers || hasMoreGroups))) && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Icon icon="eos-icons:loading" className="w-5 h-5" />
                                    ) : (
                                        'Xem thêm'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && totalResults === 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <Icon icon="fluent:search-24-regular" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Không tìm thấy kết quả
                                </h3>
                                <p className="text-gray-500">
                                    Thử tìm kiếm với từ khóa khác hoặc kiểm tra lỗi chính tả
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;
