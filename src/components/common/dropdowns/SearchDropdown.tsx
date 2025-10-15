import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../utilities/path';
import '../../../styles/main-header.css';

interface SearchItem {
    id: string;
    name: string;
    type: 'page' | 'person' | 'search';
    avatar?: string;
    newMessages?: number;
    description?: string;
}

interface SearchResultsProps {
    onClose?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [searchItems, setSearchItems] = useState<SearchItem[]>([
        {
            id: '1',
            name: 'Xa Lộ Zodiac',
            type: 'page',
            avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=40&h=40&fit=crop&crop=face',
            newMessages: 2,
            description: '2 thông tin mới'
        },
        {
            id: '2',
            name: 'Dưa Hấu Moliy Holiy',
            type: 'page',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            newMessages: 9,
            description: '9+ thông tin mới'
        },
        {
            id: '3',
            name: 'PHÒNG TRỌ SINH VIÊN ĐH KIẾN TRÚC, BƯU CHÍNH,...',
            type: 'page',
            avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=40&h=40&fit=crop&crop=face',
            newMessages: 9,
            description: '9+ thông tin mới'
        },
        {
            id: '4',
            name: 'trọ hà đông',
            type: 'search',
            description: 'Tìm kiếm gần đây'
        },
        {
            id: '5',
            name: 'Vua Hải Quân',
            type: 'page',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            newMessages: 6,
            description: '6 thông tin mới'
        },
        {
            id: '6',
            name: 'beat quảng ninh',
            type: 'search',
            description: 'Tìm kiếm gần đây'
        },
        {
            id: '7',
            name: 'Trần Dần',
            type: 'person',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: '8',
            name: 'ca map dua hau',
            type: 'search',
            description: 'Tìm kiếm gần đây'
        }
    ]);

    const removeItem = (id: string) => {
        setSearchItems(items => items.filter(item => item.id !== id));
    };

    const getAvatarIcon = (item: SearchItem) => {
        if (item.avatar) {
            return (
                <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            );
        }

        if (item.type === 'search') {
            return (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Icon icon="fluent:clock-24-filled" className="w-5 h-5 text-black" />
                </div>
            );
        }

        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Icon icon="fluent:person-24-filled" className="w-5 h-5 text-black" />
            </div>
        );
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
                {searchItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex p-3 rounded-xl items-center hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0 mr-3">
                            {getAvatarIcon(item)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex flex-col space-x-2">
                                <p className="text-sm font-medium truncate">
                                    {item.name}
                                </p>
                                {item.newMessages && (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            {item.description}
                                        </span>
                                    </div>
                                )}
                                {!item.newMessages && item.description && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeItem(item.id);
                            }}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4 text-black" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;