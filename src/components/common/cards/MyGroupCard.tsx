import React from 'react';
import { Icon } from '@iconify/react';

export interface MyGroupCardProps {
  id: string;
  name: string;
  avatar: string;
  lastActivity: string;
  onViewClick?: (id: string) => void;
  onMoreClick?: (id: string) => void;
  onClick?: () => void;
}

const MyGroupCard: React.FC<MyGroupCardProps> = ({
  id,
  name,
  avatar,
  lastActivity,
  onViewClick,
  onMoreClick,
  onClick
}) => {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-colors duration-200 flex flex-col h-full"
    >
      {/* Group Info */}
      <div 
        className="flex items-start p-3 gap-3 cursor-pointer flex-1"
        onClick={onClick}
      >
        {/* Avatar */}
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
        />

        {/* Text Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 
            className="font-semibold text-[15px] mb-1 line-clamp-2 text-gray-900 leading-tight"
          >
            {name}
          </h3>
          <p 
            className="text-xs text-gray-500 line-clamp-1"
          >
            {lastActivity}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-3 pb-3 mt-auto">
        {/* View Group Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onViewClick) {
              onViewClick(id);
            }
          }}
          className="flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 bg-gray-200 text-gray-900 hover:bg-gray-300"
        >
          Xem nhóm
        </button>

        {/* More Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onMoreClick) {
              onMoreClick(id);
            }
          }}
          className="w-10 h-10 rounded-md flex items-center justify-center transition-colors cursor-pointer bg-gray-200 hover:bg-gray-300 flex-shrink-0"
        >
          <Icon 
            icon="fluent:more-horizontal-24-filled" 
            className="w-5 h-5 text-gray-700"
          />
        </button>
      </div>
    </div>
  );
};

export default MyGroupCard;
