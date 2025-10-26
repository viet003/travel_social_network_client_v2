import React from 'react';
import { Icon } from '@iconify/react';
import { UserResultItem } from '../../items';
import type { UserResultItemProps } from '../../items/UserResultItem';

interface SearchFriendDropdownProps {
  searchResults: UserResultItemProps[];
  onRemove: (id: string) => void;
  onItemClick: (item: UserResultItemProps) => void;
  onClose: () => void;
}

const SearchFriendDropdown: React.FC<SearchFriendDropdownProps> = ({
  searchResults,
  onRemove,
  onItemClick,
  onClose
}) => {
  return (
    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50">
      {/* Search Results Header */}
      <div className="flex items-center justify-between p-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">Tìm kiếm gần đây</h3>
        <button 
          className="text-sm font-normal hover:bg-gray-100 rounded-full px-3 py-1 cursor-pointer transition-colors"
          style={{ color: 'var(--travel-primary-500)' }}
        >
          Chỉnh sửa
        </button>
      </div>

      {/* Search Results List */}
      <div className="max-h-96 overflow-y-auto">
        {searchResults.map((item) => (
          <UserResultItem
            key={item.id}
            {...item}
            onRemove={onRemove}
            onClick={() => {
              onItemClick(item);
              onClose();
            }}
          />
        ))}
      </div>

      {searchResults.length === 0 && (
        <div className="text-center py-8">
          <Icon icon="fluent:search-24-regular" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Không có kết quả tìm kiếm gần đây</p>
        </div>
      )}
    </div>
  );
};

export default SearchFriendDropdown;
