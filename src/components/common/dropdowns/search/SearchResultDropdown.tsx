import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../../utilities/path';
import { UserResultItem, GroupResultItem } from '../../items';
import type { UserResultItemProps } from '../../items/UserResultItem';
import type { GroupResultItemProps } from '../../items/GroupResultItem';
import '../../../../styles/main-header.css';

interface SearchResultDropdownProps {
    onClose?: () => void;
}

const SearchResultDropdown: React.FC<SearchResultDropdownProps> = ({ onClose }) => {
    const navigate = useNavigate();
    
    // Mock data cho users
    const [userItems, setUserItems] = useState<UserResultItemProps[]>([
        {
            id: '1',
            name: 'Trần Dần',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            description: 'Bạn bè'
        },
        {
            id: '2',
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            description: 'Bạn bè'
        },
        {
            id: '3',
            name: 'Lê Thị B',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            description: 'Bạn chung'
        }
    ]);

    // Mock data cho groups
    const [groupItems, setGroupItems] = useState<GroupResultItemProps[]>([
        {
            id: '4',
            name: 'Du lịch Việt Nam',
            avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
            description: 'Nhóm công khai',
            memberCount: 1500
        },
        {
            id: '5',
            name: 'Phượt Đà Lạt',
            avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=40&h=40&fit=crop&crop=face',
            description: 'Nhóm riêng tư',
            memberCount: 850
        },
        {
            id: '6',
            name: 'Ẩm thực Sài Gòn',
            avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=40&h=40&fit=crop&crop=face',
            description: 'Nhóm công khai',
            memberCount: 2300
        }
    ]);

    const removeUserItem = (id: string) => {
        setUserItems(items => items.filter(item => item.id !== id));
    };

    const removeGroupItem = (id: string) => {
        setGroupItems(items => items.filter(item => item.id !== id));
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
                <div className="relative flex-1 w-65 md:hidden">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon="fluent:search-24-filled" className="h-4 w-4 text-black" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trên TravelNest"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm placeholder-gray-500 focus:outline-none transition-all duration-200 cursor-text"
                    />
                </div>
            </div>

            {/* Recent Section Header */}
            <div className="flex items-center justify-between p-4 h-[55px]">
                <h3 className="font-medium text-gray-900">Mới đây</h3>
                <button className="text-blue-500 font-normal text-sm hover:text-blue-500 hover:bg-gray-100 rounded-full px-2 py-1 cursor-pointer transition-colors">
                    Chỉnh sửa
                </button>
            </div>

            {/* Search Items List */}
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
                                    console.log('Clicked user:', user.name);
                                    // Navigate to user profile or handle click
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
                                    console.log('Clicked group:', group.name);
                                    // Navigate to group page or handle click
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {userItems.length === 0 && groupItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Icon icon="fluent:search-24-regular" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Không có kết quả tìm kiếm</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultDropdown;
