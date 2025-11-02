import React from 'react';
import { Icon } from '@iconify/react';

interface UserSettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  onBlock: () => void;
}

const UserSettingsDropdown: React.FC<UserSettingsDropdownProps> = ({
  isOpen,
  onClose,
  onReport,
  onBlock,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close dropdown */}
      <div 
        className="fixed inset-0 z-10" 
        onClick={onClose}
      />
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
        <div className="py-2">
          <button
            onClick={onReport}
            className="w-full flex items-center space-x-3 py-2 px-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="lucide:flag" className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">Báo cáo</p>
              <p className="text-xs text-gray-500">Báo cáo vi phạm hoặc spam</p>
            </div>
          </button>
          
          <button
            onClick={onBlock}
            className="w-full flex items-center space-x-3 py-2 px-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon="lucide:user-x" className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-red-600">Chặn người dùng</p>
              <p className="text-xs text-red-500">Ngăn họ xem nội dung của bạn</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSettingsDropdown;
