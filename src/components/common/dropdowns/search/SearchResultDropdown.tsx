import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../../utilities/path';
import { UserResultItem, GroupResultItem } from '../../items';
import type { UserResultItemProps } from '../../items/UserResultItem';
import type { GroupResultItemProps } from '../../items/GroupResultItem';
import { apiSearchSuggestions } from '../../../../services/searchService';
import type { UserResponse } from '../../../../types/user.types';
import type { GroupResponse } from '../../../../types/group.types';
import { avatarDefault } from '../../../../assets/images';
import '../../../../styles/main-header.css';

interface SearchResultDropdownProps {
    onClose?: () => void;
    searchQuery?: string;
}

const SearchResultDropdown: React.FC<SearchResultDropdownProps> = ({ onClose, searchQuery = '' }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState(searchQuery);
    const [userItems, setUserItems] = useState<UserResultItemProps[]>([]);
    const [groupItems, setGroupItems] = useState<GroupResultItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sync local query with parent searchQuery prop
    useEffect(() => {
        console.log('🔄 Syncing query with searchQuery prop:', searchQuery);
        setQuery(searchQuery);
    }, [searchQuery]);

    // Fetch search suggestions - removed debounce for direct API call
    const fetchSearchResults = useCallback(async (keyword: string) => {
        console.log('🔍 fetchSearchResults called with keyword:', keyword);
        
        if (!keyword.trim()) {
            console.log('⚠️ Keyword is empty, clearing results');
            setUserItems([]);
            setGroupItems([]);
            return;
        }

        console.log('📡 Calling API with keyword:', keyword);
        setIsLoading(true);
        try {
            const response = await apiSearchSuggestions(keyword);
            console.log('✅ API Response:', response);
            
            // Map users to UserResultItemProps
            const users: UserResultItemProps[] = response.data.users.map((user: UserResponse) => ({
                id: user.userId || '',
                name: user.userProfile?.fullName || user.userName,
                avatar: user.avatarImg || avatarDefault,
                description: user.friendshipStatus ? 'Bạn bè' : 'Bạn chung'
            }));

            // Map groups to GroupResultItemProps
            const groups: GroupResultItemProps[] = response.data.groups.map((group: GroupResponse) => ({
                id: group.groupId,
                name: group.groupName,
                avatar: group.coverImageUrl || avatarDefault,
                description: group.privacy ? 'Nhóm riêng tư' : 'Nhóm công khai',
                memberCount: group.memberCount
            }));

            console.log('📊 Setting users:', users.length, 'groups:', groups.length);
            setUserItems(users);
            setGroupItems(groups);
        } catch (error) {
            console.error('❌ Error fetching search results:', error);
            setUserItems([]);
            setGroupItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to fetch on query change - direct call without debounce
    useEffect(() => {
        console.log('🎯 useEffect triggered with query:', query);
        fetchSearchResults(query);
    }, [query, fetchSearchResults]);

    const removeUserItem = (id: string) => {
        setUserItems(items => items.filter(item => item.id !== id));
    };

    const removeGroupItem = (id: string) => {
        setGroupItems(items => items.filter(item => item.id !== id));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            if (onClose) onClose();
        }
    };

    return (
        <div className="bg-white rounded-b-2xl shadow-xl border-none w-[380px] p-3">
            {/* Search Header */}
            <div className="flex items-center space-x-3 flex-1 max-w-md">
                {/* Back Arrow */}
                <div
                    className='w-20 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer'
                    onClick={() => {
                        if (onClose) {
                            onClose();
                        } else {
                            navigate(path.HOME);
                        }
                    }}
                >
                    <Icon icon="fluent:arrow-left-24-filled" className="w-6 h-6 text-black hover:text-gray-600 transition-colors" />
                </div>

                {/* Search Bar - Desktop */}
                <div className="relative flex-1 w-65">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="fluent:search-24-filled" className="h-4 w-4 text-black" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trên TravelNest"
                        value={query}
                        onChange={(e) => {
                            console.log('⌨️ Input onChange:', e.target.value);
                            setQuery(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 cursor-text"
                    />
                </div>
            </div>

            {/* Recent Section Header */}
            <div className="flex items-center justify-between p-4 h-[55px]">
                <h3 className="font-medium text-gray-900">
                    {query.trim() ? 'Kết quả tìm kiếm' : 'Mới đây'}
                </h3>
                {!query.trim() && (
                    <button className="text-blue-500 font-normal text-sm hover:text-blue-500 hover:bg-gray-100 rounded-full px-2 py-1 cursor-pointer transition-colors">
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <Icon icon="eos-icons:loading" className="w-8 h-8 text-blue-500" />
                </div>
            )}

            {/* Search Items List */}
            {!isLoading && (
                <div
                    className="max-h-113 overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
                    }}
                >
                    {/* Users Section */}
                    {userItems.length > 0 && (
                        <div className="mb-4">
                            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Người dùng</h4>
                            {userItems.map((user) => (
                                <UserResultItem
                                    key={user.id}
                                    {...user}
                                    onRemove={removeUserItem}
                                    onClick={() => {
                                        navigate(`${path.HOME}/user/${user.id}`);
                                        if (onClose) onClose();
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Groups Section */}
                    {groupItems.length > 0 && (
                        <div>
                            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Nhóm</h4>
                            {groupItems.map((group) => (
                                <GroupResultItem
                                    key={group.id}
                                    {...group}
                                    onRemove={removeGroupItem}
                                    onClick={() => {
                                        navigate(`${path.HOME}/groups/${group.id}`);
                                        if (onClose) onClose();
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {userItems.length === 0 && groupItems.length === 0 && query.trim() && (
                        <div className="text-center py-8 text-gray-500">
                            <Icon icon="fluent:search-24-regular" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Không có kết quả tìm kiếm cho "{query}"</p>
                        </div>
                    )}

                    {/* No query state */}
                    {!query.trim() && (
                        <div className="text-center py-8 text-gray-500">
                            <Icon icon="fluent:search-24-regular" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Nhập từ khóa để tìm kiếm</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResultDropdown;
