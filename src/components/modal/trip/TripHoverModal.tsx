import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { type TripCalendar } from '../../../types/trip.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface TripHoverModalProps {
  trip: TripCalendar;
  anchorElement: HTMLElement | null;
  onClose: () => void;
}

const TripHoverModal: React.FC<TripHoverModalProps> = ({ trip, anchorElement, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorElement || !modalRef.current) return;

    const calculatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const modalRect = modalRef.current!.getBoundingClientRect();
      const padding = 8;

      let top = anchorRect.bottom + padding;
      let left = anchorRect.left + (anchorRect.width / 2) - (modalRect.width / 2);

      // Adjust if modal goes off screen
      if (left + modalRect.width > window.innerWidth) {
        left = window.innerWidth - modalRect.width - padding;
      }
      if (left < padding) {
        left = padding;
      }

      // If modal goes below viewport, show above anchor
      if (top + modalRect.height > window.innerHeight) {
        top = anchorRect.top - modalRect.height - padding;
      }

      setPosition({ top, left });
    };

    calculatePosition();
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [anchorElement]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ONGOING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'Đang lên kế hoạch';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'ONGOING':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 animate-fadeIn"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={() => {}} // Keep modal open when hovering over it
      onMouseLeave={onClose}
    >
      {/* Group Info */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <img
          src={trip.conversationAvatar || 'https://via.placeholder.com/48'}
          alt={trip.conversationName || 'Group'}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate text-sm">
            {trip.conversationName || 'Nhóm không tên'}
          </h3>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(trip.status)}`}>
            <Icon icon="fluent:status-16-filled" className="w-3 h-3" />
            {getStatusText(trip.status)}
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Icon icon="fluent:navigation-24-filled" className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">{trip.tripName}</p>
            {trip.destination && (
              <p className="text-xs text-gray-500 truncate">{trip.destination}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Icon icon="fluent:calendar-24-regular" className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            {dayjs(trip.startDate).format('DD/MM/YYYY')} - {dayjs(trip.endDate).format('DD/MM/YYYY')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Icon icon="fluent:clock-24-regular" className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            {dayjs(trip.scheduleDate).format('DD/MM/YYYY')}
            {trip.schedulesOnDate > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                {trip.schedulesOnDate} hoạt động
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Click để xem chi tiết
        </p>
      </div>
    </div>
  );
};

export default TripHoverModal;
