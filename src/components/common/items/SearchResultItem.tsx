import React from 'react';
import { Icon } from '@iconify/react';

export interface SearchResultItemProps {
  id: string;
  name: string;
  type: 'page' | 'person' | 'search';
  avatar?: string;
  newMessages?: number;
  description?: string;
  onRemove?: (id: string) => void;
  onClick?: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  name,
  type,
  avatar,
  newMessages,
  description,
  onRemove,
  onClick
}) => {
  const getAvatarIcon = () => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    if (type === 'search') {
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
    <div
      className="flex p-3 rounded-xl items-center hover:bg-gray-100 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3">
        {getAvatarIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col space-x-2">
          <p className="text-sm font-medium truncate">
            {name}
          </p>
          {newMessages && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {description}
              </span>
            </div>
          )}
          {!newMessages && description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Icon icon="fluent:dismiss-24-filled" className="w-4 h-4 text-black" />
        </button>
      )}
    </div>
  );
};

export default SearchResultItem;
