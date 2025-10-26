import React from 'react';
import { Icon } from '@iconify/react';

export interface FriendCardProps {
  id: number;
  name: string;
  avatar: string;
  mutualFriends?: number | null;
  followers?: number | null;
  timeAgo?: string;
  reason?: string;
  date?: string;
  age?: number;
  // Action buttons configuration
  primaryAction?: {
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
  // Optional custom content
  onCardClick?: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({
  name,
  avatar,
  mutualFriends,
  followers,
  timeAgo,
  reason,
  date,
  age,
  primaryAction,
  secondaryAction,
  onCardClick
}) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col h-full"
      onClick={onCardClick}
    >
      {/* Profile Picture */}
      <div className="mb-3 flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          className="w-full aspect-square object-cover rounded-lg"
        />
      </div>

      {/* Name */}
      <h3 
        className="text-gray-900 font-medium text-sm mb-2 line-clamp-2 hover:transition-colors cursor-pointer min-h-[2.5rem]"
        style={{ 
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--travel-primary-500)'}
        onMouseLeave={(e) => e.currentTarget.style.color = ''}
      >
        {name}
      </h3>

      {/* Connection Info */}
      <div className="mb-4 min-h-[3rem] flex-1">
        {mutualFriends !== null && mutualFriends !== undefined && (
          <div className="flex items-center space-x-1 text-gray-600 text-xs mb-1">
            <Icon icon="fluent:people-24-filled" className="h-3 w-3" />
            <span>{mutualFriends} bạn chung</span>
          </div>
        )}
        
        {followers !== null && followers !== undefined && (
          <div className="text-gray-600 text-xs mb-1">
            Có {followers} người theo dõi
          </div>
        )}
        
        {timeAgo && (
          <div className="text-gray-500 text-xs line-clamp-1">{timeAgo}</div>
        )}
        
        {reason && (
          <div className="text-gray-500 text-xs mt-1 line-clamp-2">{reason}</div>
        )}
        
        {date && (
          <div className="text-gray-600 text-sm">{date}</div>
        )}
        
        {age !== undefined && (
          <p className="text-gray-600 text-sm">
            <Icon icon="fluent:balloon-24-regular" className="inline h-4 w-4 mr-1" />
            {age} tuổi hôm nay
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="space-y-2 mt-auto">
          {primaryAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                primaryAction.onClick();
              }}
              className={`w-full text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                primaryAction.variant === 'secondary'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'text-white'
              }`}
              style={primaryAction.variant !== 'secondary' ? {
                backgroundColor: 'var(--travel-primary-500)',
              } : {}}
              onMouseEnter={(e) => {
                if (primaryAction.variant !== 'secondary') {
                  e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)';
                }
              }}
              onMouseLeave={(e) => {
                if (primaryAction.variant !== 'secondary') {
                  e.currentTarget.style.backgroundColor = 'var(--travel-primary-500)';
                }
              }}
            >
              {primaryAction.icon && (
                <Icon icon={primaryAction.icon} className="inline h-4 w-4 mr-1" />
              )}
              {primaryAction.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                secondaryAction.onClick();
              }}
              className="w-full bg-gray-200 text-gray-700 text-xs py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer flex items-center justify-center"
            >
              {secondaryAction.icon && (
                <Icon icon={secondaryAction.icon} className="inline h-4 w-4 mr-1" />
              )}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendCard;
