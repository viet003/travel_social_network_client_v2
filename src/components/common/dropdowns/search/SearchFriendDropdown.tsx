import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { UserResultItem } from '../../items';
import type { UserResultItemProps } from '../../items/UserResultItem';
import { apiSearchUsersByKeyword } from '../../../../services/userService';
import type { UserResponse } from '../../../../types/user.types';
import { useNavigate } from 'react-router-dom';

interface SearchFriendDropdownProps {
  searchQuery: string;
  onClose: () => void;
}

const SearchFriendDropdown: React.FC<SearchFriendDropdownProps> = ({
  searchQuery,
  onClose
}) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<UserResultItemProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiSearchUsersByKeyword(query, 0, 5);
      const users = response.data.content.map((user: UserResponse) => ({
        id: user.userId || '',
        name: user.userProfile?.fullName || user.userName,
        avatar: user.avatarImg || undefined,
        subtitle: `@${user.userName}`,
        type: 'user' as const
      }));
      setSearchResults(users);
    } catch (error) {
      console.error('Search users error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsers]);

  const handleItemClick = (item: UserResultItemProps) => {
    navigate(`/home/user/${item.id}`);
    onClose();
  };

  return (
    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50"
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
          </div>
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((item) => (
              <UserResultItem
                key={item.id}
                {...item}
                onRemove={() => {}}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8">
          <Icon icon="fluent:search-24-regular" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Không tìm thấy người dùng</p>
        </div>
      )}
    </div>
  );
};

export default SearchFriendDropdown;
