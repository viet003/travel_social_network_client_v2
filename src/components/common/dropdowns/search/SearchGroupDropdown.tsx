import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { GroupResultItem } from '../../items';
import type { GroupResultItemProps } from '../../items/GroupResultItem';
import { apiSearchGroups } from '../../../../services/groupService';
import type { GroupResponse } from '../../../../types/group.types';
import { useNavigate } from 'react-router-dom';

interface SearchGroupDropdownProps {
  searchQuery: string;
  onClose: () => void;
}

const SearchGroupDropdown: React.FC<SearchGroupDropdownProps> = ({
  searchQuery,
  onClose
}) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<GroupResultItemProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiSearchGroups(query, 0, 5);
      const groups = response.data.content.map((group: GroupResponse) => ({
        id: group.groupId,
        name: group.groupName,
        avatar: group.coverImageUrl || undefined,
        subtitle: `${group.memberCount} thành viên`,
        type: 'group' as const
      }));
      setSearchResults(groups);
    } catch (error) {
      console.error('Search groups error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGroups(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchGroups]);

  const handleItemClick = (item: GroupResultItemProps) => {
    navigate(`/home/groups/${item.id}`);
    onClose();
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
          </div>
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((item) => (
              <GroupResultItem
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
          <Icon icon="fluent:people-community-24-regular" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Không tìm thấy nhóm</p>
        </div>
      )}
    </div>
  );
};

export default SearchGroupDropdown;
