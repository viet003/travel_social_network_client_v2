import React, { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface PostOptionsDropdownProps {
  onClose: () => void;
  isOwner?: boolean;
  postId?: string;
}

interface PostMenuItem {
  id: string;
  icon: string;
  title: string;
  description?: string;
  onClick?: () => void;
  isDivider?: boolean;
}

const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({ 
  onClose, 
  isOwner = false,
  postId 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menu items for post owner
  const ownerMenuItems: PostMenuItem[] = [
    {
      id: 'interested',
      icon: 'fluent:add-circle-24-regular',
      title: 'Quan tâm',
      description: 'Bạn sẽ nhìn thấy nhiều bài viết tương tự hơn.'
    },
    {
      id: 'not-interested',
      icon: 'fluent:subtract-circle-24-regular',
      title: 'Không quan tâm',
      description: 'Bạn sẽ nhìn thấy ít bài viết tương tự hơn.'
    },
    {
      id: 'save',
      icon: 'fluent:bookmark-24-regular',
      title: 'Lưu bài viết',
      description: 'Thêm vào danh sách mục đã lưu.'
    },
    {
      id: 'notification',
      icon: 'fluent:alert-24-regular',
      title: 'Bật thông báo về bài viết này'
    },
    {
      id: 'report-admin',
      icon: 'fluent:person-star-24-regular',
      title: 'Báo cáo bài viết với quản trị viên nhóm'
    },
    {
      id: 'hide',
      icon: 'fluent:eye-off-24-regular',
      title: 'Ẩn bài viết',
      description: 'Ẩn bớt các bài viết tương tự.'
    },
    {
      id: 'snooze',
      icon: 'fluent:clock-pause-24-regular',
      title: 'Tạm ẩn Đại trong 30 ngày',
      description: 'Tạm thời không nhìn thấy bài viết nữa.'
    },
    {
      id: 'hide-all',
      icon: 'fluent:dismiss-circle-24-regular',
      title: 'Ẩn tất cả từ Đại',
      description: 'Không nhìn thấy bài viết từ người này nữa. Họ sẽ không nhận thông báo là bạn đã ẩn họ được nữa.'
    }
  ];

  // Menu items for non-owner
  const nonOwnerMenuItems: PostMenuItem[] = [
    {
      id: 'interested',
      icon: 'fluent:add-circle-24-regular',
      title: 'Quan tâm',
      description: 'Bạn sẽ nhìn thấy nhiều bài viết tương tự hơn.'
    },
    {
      id: 'not-interested',
      icon: 'fluent:subtract-circle-24-regular',
      title: 'Không quan tâm',
      description: 'Bạn sẽ nhìn thấy ít bài viết tương tự hơn.'
    },
    {
      id: 'save',
      icon: 'fluent:bookmark-24-regular',
      title: 'Lưu bài viết',
      description: 'Thêm vào danh sách mục đã lưu.'
    },
    {
      id: 'notification',
      icon: 'fluent:alert-24-regular',
      title: 'Bật thông báo về bài viết này'
    },
    {
      id: 'report-admin',
      icon: 'fluent:person-star-24-regular',
      title: 'Báo cáo bài viết với quản trị viên nhóm'
    },
    {
      id: 'hide',
      icon: 'fluent:eye-off-24-regular',
      title: 'Ẩn bài viết',
      description: 'Ẩn bớt các bài viết tương tự.'
    },
    {
      id: 'snooze',
      icon: 'fluent:clock-pause-24-regular',
      title: 'Tạm ẩn Đại trong 30 ngày',
      description: 'Tạm thời không nhìn thấy bài viết nữa.'
    },
    {
      id: 'hide-all',
      icon: 'fluent:dismiss-circle-24-regular',
      title: 'Ẩn tất cả từ Đại',
      description: 'Không nhìn thấy bài viết từ người này nữa. Họ sẽ không nhận thông báo là bạn đã ẩn họ được nữa.'
    }
  ];

  const menuItems = isOwner ? ownerMenuItems : nonOwnerMenuItems;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleMenuClick = (itemId: string) => {
    console.log(`Post ${postId} - Action: ${itemId}`);
    // Add your logic here based on itemId
    
    // Close dropdown after action
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-[500px] overflow-y-auto"
    >
      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className="w-full flex items-start gap-3 py-2 px-3 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
              <Icon icon={item.icon} className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostOptionsDropdown;
