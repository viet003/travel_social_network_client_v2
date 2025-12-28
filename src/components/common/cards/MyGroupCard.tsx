import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import TravelButton from '../../ui/customize/TravelButton';

export interface MyGroupCardProps {
  id: string;
  name: string;
  avatar: string;
  lastActivity: string;
  isPending?: boolean; // Indicates if this is a pending request
  currentUserRole?: string | null; // OWNER, ADMIN, MODERATOR, MEMBER, null if not a member
  onViewClick?: (id: string) => void;
  onMoreClick?: (id: string) => void;
  onCancelRequest?: (id: string) => void; // Callback for canceling request
  onLeaveGroup?: (id: string) => void; // Callback for leaving group
  onClick?: () => void;
}

const MyGroupCard: React.FC<MyGroupCardProps> = ({
  id,
  name,
  avatar,
  lastActivity,
  isPending = false,
  currentUserRole,
  onViewClick,
  onCancelRequest,
  onLeaveGroup,
  onClick
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is OWNER or ADMIN - they cannot leave the group
  const canLeaveGroup = currentUserRole !== 'OWNER';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleCancelRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onCancelRequest) {
      onCancelRequest(id);
    }
  };

  const handleCloseDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
  };

  const handleLeaveGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onLeaveGroup) {
      onLeaveGroup(id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 transition-colors duration-200 flex flex-col h-full"
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
            className="font-semibold text-[15px] mb-1 text-gray-900 leading-tight break-words"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
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
        <div 
          className="flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <TravelButton
            type="default"
            onClick={() => {
              if (onViewClick) {
                onViewClick(id);
              }
            }}
            className="!h-10 !w-full !bg-gray-100 hover:!bg-gray-200 transition-colors"
          >
            Xem nhóm
          </TravelButton>
        </div>

        {/* More Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleMoreClick}
            className="w-10 h-10 rounded-md flex items-center justify-center transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 flex-shrink-0"
          >
            <Icon 
              icon="fluent:more-horizontal-24-filled" 
              className="w-5 h-5 text-gray-700"
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              {isPending ? (
                // Pending request: Show cancel option
                <button
                  onClick={handleCancelRequest}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <Icon icon="fluent:dismiss-circle-24-regular" className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-red-600">
                      Hủy yêu cầu
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Hủy yêu cầu tham gia nhóm này
                    </div>
                  </div>
                </button>
              ) : (
                // Joined group: Show leave option only if user is not OWNER or ADMIN
                canLeaveGroup && (
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <Icon icon="fluent:sign-out-24-regular" className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-red-600">
                        Rời nhóm
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Rời khỏi nhóm này
                      </div>
                    </div>
                  </button>
                )
              )}
              <button
                onClick={handleCloseDropdown}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <Icon icon="fluent:dismiss-24-regular" className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    Đóng
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Đóng menu này
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGroupCard;
