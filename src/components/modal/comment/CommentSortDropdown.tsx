import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

export type SortOption = 'newest' | 'oldest' | 'most_relevant';

interface SortOptionType {
  value: SortOption;
  label: string;
  icon: string;
  description: string;
}

const sortOptions: SortOptionType[] = [
  {
    value: 'most_relevant',
    label: 'Bình luận phù hợp nhất',
    icon: 'fluent:star-24-filled',
    description: 'Bình luận có nhiều lượt thích nhất'
  },
  {
    value: 'newest',
    label: 'Bình luận mới nhất',
    icon: 'fluent:arrow-sort-down-24-filled',
    description: 'Bình luận mới nhất trước'
  },
  {
    value: 'oldest',
    label: 'Bình luận cũ nhất',
    icon: 'fluent:arrow-sort-up-24-filled',
    description: 'Bình luận cũ nhất trước'
  }
];

interface CommentSortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const CommentSortDropdown: React.FC<CommentSortDropdownProps> = ({
  currentSort,
  onSortChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectOption = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mt-2 mb-3 text-sm font-semibold text-gray-500 transition-colors bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
      >
        <Icon icon={currentOption.icon} className="w-5 h-5 text-blue-600" />
        <span>{currentOption.label}</span>
        <Icon 
          icon={isOpen ? "fluent:chevron-up-24-filled" : "fluent:chevron-down-24-filled"} 
          className="w-4 h-4 transition-transform duration-200"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-72 animate-in fade-in zoom-in duration-200">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`flex items-start w-full gap-3 px-3 py-2.5 transition-colors cursor-pointer hover:bg-gray-50 ${
                  currentSort === option.value ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`flex items-center justify-center flex-shrink-0 w-9 h-9 mt-0.5 rounded-full ${
                  currentSort === option.value ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon 
                    icon={option.icon} 
                    className={`w-5 h-5 ${
                      currentSort === option.value ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold leading-tight ${
                      currentSort === option.value ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </p>
                    {currentSort === option.value && (
                      <Icon icon="fluent:checkmark-circle-24-filled" className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs leading-tight text-gray-500">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSortDropdown;
