import React from 'react';
import { Icon } from '@iconify/react';
import TravelButton from '../../ui/customize/TravelButton';

export interface OtherGroupCardProps {
  id: string;
  name: string;
  coverImage: string;
  memberCount: number;
  postsPerDay: number;
  privacy?: boolean; // true = private, false = public
  friendMembers?: {
    name: string;
    avatar: string;
  }[];
  onJoinClick?: (id: string) => void;
  onRemoveClick?: (id: string) => void;
  onClick?: () => void;
  isJoining?: boolean;
  requestStatus?: 'PENDING' | 'APPROVED';
}

const OtherGroupCard: React.FC<OtherGroupCardProps> = ({
  id,
  name,
  coverImage,
  memberCount,
  postsPerDay,
  privacy,
  friendMembers = [],
  onJoinClick,
  onRemoveClick,
  onClick,
  isJoining = false,
  requestStatus
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-colors duration-200 flex flex-col h-full">
      {/* Cover Image */}
      <div 
        className="relative w-full h-40 bg-gray-200 cursor-pointer overflow-hidden flex-shrink-0"
        onClick={onClick}
      >
        <img 
          src={coverImage} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Close button overlay */}
        <button 
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemoveClick) {
              onRemoveClick(id);
            }
          }}
        >
          <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Group Name */}
        <h3 
          className="font-semibold text-base text-gray-900 mb-2 cursor-pointer hover:underline line-clamp-2 min-h-[3rem]"
          onClick={onClick}
        >
          {name}
        </h3>

        {/* Privacy Badge */}
        <div className="flex items-center mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            privacy 
              ? 'bg-gray-100 text-gray-700' 
              : 'bg-blue-50 text-blue-700'
          }`}>
            <Icon 
              icon={privacy ? "fluent:lock-closed-20-filled" : "fluent:globe-20-filled"} 
              className="w-3 h-3 mr-1" 
            />
            {privacy ? 'Riêng tư' : 'Công khai'}
          </span>
        </div>

        {/* Group Stats */}
        <div className="flex items-center text-sm mb-3 text-gray-500">
          <span>{formatNumber(memberCount)} thành viên</span>
          <span className="mx-1">•</span>
          <span>{postsPerDay}+ bài viết/ngày</span>
        </div>

        {/* Friend Members */}
        {friendMembers.length > 0 && (
          <div className="flex items-center mb-3 min-h-[2rem]">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {friendMembers.slice(0, 3).map((friend, index) => (
                <img
                  key={index}
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            {/* Text */}
            <span className="ml-2 text-xs text-gray-500 line-clamp-1">
              {friendMembers[0]?.name}
              {friendMembers.length > 1 && ` và ${friendMembers.length - 1} người bạn là thành viên`}
              {friendMembers.length === 1 && ' là thành viên'}
            </span>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Join Button */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="flex justify-end"
        >
          {requestStatus === 'PENDING' ? (
            <TravelButton
              type="default"
              disabled
              className="!h-10 !bg-gray-100 !w-auto"
            >
              <div className="flex items-center justify-center">
                <Icon icon="fluent:clock-24-regular" className="w-4 h-4 mr-2" />
                Đang chờ duyệt
              </div>
            </TravelButton>
          ) : (
            <TravelButton
              type="default"
              loading={isJoining}
              disabled={isJoining}
              className="!h-10 !bg-gray-100 hover:!bg-gray-200 !w-auto transition-colors"
              onClick={() => {
                if (onJoinClick && !isJoining) {
                  onJoinClick(id);
                }
              }}
            >
              {isJoining ? 'Đang tham gia...' : 'Tham gia nhóm'}
            </TravelButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherGroupCard;
