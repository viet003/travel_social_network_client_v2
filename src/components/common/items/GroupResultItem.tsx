import React from 'react';
import { Icon } from '@iconify/react';

export interface GroupResultItemProps {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  memberCount?: number;
  onRemove?: (id: string) => void;
  onClick?: () => void;
}

const GroupResultItem: React.FC<GroupResultItemProps> = ({
  id,
  name,
  avatar,
  description,
  memberCount,
  onRemove,
  onClick
}) => {
  const getAvatar = () => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <Icon icon="fluent:people-24-filled" className="w-5 h-5 text-black" />
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
        {getAvatar()}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col space-x-2">
          <p className="text-sm font-medium truncate">
            {name}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          )}
          {memberCount !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              {memberCount} thành viên
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

export default GroupResultItem;
