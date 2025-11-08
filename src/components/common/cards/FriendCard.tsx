import React from "react";
import { Icon } from "@iconify/react";
import avatardf from "../../../assets/images/avatar_default.png";
import TravelButton from "../../ui/customize/TravelButton";

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
    variant?: "primary" | "secondary";
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
  onCardClick,
}) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onCardClick}
    >
      {/* Profile Picture */}
      <div className="relative overflow-hidden">
        <img
          src={avatar || avatardf}
          alt={name}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Name */}
        <h3 className="text-gray-900 font-semibold text-base mb-1.5 line-clamp-1 hover:text-travel-primary-500 transition-colors">
          {name}
        </h3>

        {/* Connection Info */}
        <div className="mb-3 space-y-1 min-h-[3rem]">
          {mutualFriends !== null && mutualFriends !== undefined && (
            <div className="flex items-center text-gray-600 text-sm">
              <Icon
                icon="fluent:people-24-filled"
                className="h-4 w-4 mr-1.5 text-travel-primary-500"
              />
              <span className="font-medium">{mutualFriends}</span>
              <span className="ml-1">bạn chung</span>
            </div>
          )}

          {followers !== null && followers !== undefined && (
            <div className="flex items-center text-gray-600 text-sm">
              <Icon
                icon="fluent:eye-24-filled"
                className="h-4 w-4 mr-1.5 text-travel-primary-500"
              />
              <span>
                <span className="font-medium">{followers}</span> người theo dõi
              </span>
            </div>
          )}

          {timeAgo && (
            <div className="flex items-center text-gray-500 text-sm">
              <Icon icon="fluent:clock-24-regular" className="h-4 w-4 mr-1.5" />
              <span className="line-clamp-1">{timeAgo}</span>
            </div>
          )}

          {reason && (
            <div className="flex items-start text-gray-500 text-sm">
              <Icon
                icon="fluent:info-24-regular"
                className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0"
              />
              <span className="line-clamp-2">{reason}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center text-gray-600 text-sm">
              <Icon
                icon="fluent:calendar-24-regular"
                className="h-4 w-4 mr-1.5"
              />
              <span>{date}</span>
            </div>
          )}

          {age !== undefined && (
            <div className="flex items-center text-gray-600 text-sm">
              <Icon
                icon="fluent:balloon-24-regular"
                className="h-4 w-4 mr-1.5 text-travel-primary-500"
              />
              <span>
                <span className="font-medium">{age}</span> tuổi hôm nay
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(primaryAction || secondaryAction) && (
          <div className="flex gap-2">
            {primaryAction && (
              <div onClick={(e) => e.stopPropagation()} className="flex-1">
                <TravelButton
                  type={
                    primaryAction.variant === "secondary"
                      ? "default"
                      : "primary"
                  }
                  onClick={primaryAction.onClick}
                  className="w-full"
                >
                  <span className="flex items-center justify-center">
                    {primaryAction.icon && (
                      <Icon
                        icon={primaryAction.icon}
                        className="h-4 w-4 mr-1.5 text-blue-600"
                      />
                    )}{" "}
                    {primaryAction.label}
                  </span>
                </TravelButton>
              </div>
            )}

            {secondaryAction && (
              <div onClick={(e) => e.stopPropagation()} className="flex-1">
                <button
                  onClick={secondaryAction.onClick}
                  className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-semibold text-sm py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center whitespace-nowrap"
                  style={{ height: "40px" }}
                >
                  {secondaryAction.icon && (
                    <Icon
                      icon={secondaryAction.icon}
                      className="h-4 w-4 mr-1.5"
                    />
                  )}
                  {secondaryAction.label}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
