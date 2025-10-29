import React from 'react';
import { Icon } from '@iconify/react';
import { GroupResultItem } from '../../items';
import type { GroupResultItemProps } from '../../items/GroupResultItem';

interface SearchGroupDropdownProps {
  searchResults: GroupResultItemProps[];
  onRemove: (id: string) => void;
  onItemClick: (item: GroupResultItemProps) => void;
  onClose: () => void;
  showRecentHeader?: boolean;
}

const SearchGroupDropdown: React.FC<SearchGroupDropdownProps> = ({
  searchResults,
  onRemove,
  onItemClick,
  onClose,
  showRecentHeader = true
}) => {
  return (
    <div 
      className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50"
      onMouseDown={(e) => {
        // Prevent input blur when clicking inside dropdown
        e.preventDefault();
      }}
    >
      {/* Search Results Header */}
      {showRecentHeader && (
        <div className="flex items-center justify-between p-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">Tìm kiếm gần đây</h3>
          <button 
            className="text-sm font-normal hover:bg-gray-100 rounded-full px-3 py-1 cursor-pointer transition-colors"
            style={{ color: 'var(--travel-primary-500)' }}
          >
            Chỉnh sửa
          </button>
        </div>
      )}

      {/* Search Results List */}
      <div className="max-h-96 overflow-y-auto">
        {searchResults.map((item) => (
          <GroupResultItem
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
          <Icon icon="fluent:people-community-24-regular" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Không có kết quả tìm kiếm gần đây</p>
        </div>
      )}
    </div>
  );
};

export default SearchGroupDropdown;
