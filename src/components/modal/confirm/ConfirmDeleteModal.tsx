import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { TravelButton, TravelInput } from '../../ui/customize';
import { LoadingSpinner } from '../../ui/loading';
import { ExpandableContent } from '../../ui';

export type DeleteType = 'group' | 'conversation' | 'account' | 'post' | 'comment' | 'unfriend' | 'custom';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  type: DeleteType;
  itemName: string;
  confirmText?: string; // If not provided, will use itemName
  customTitle?: string; // Custom title, if not provided will use default based on type
  customWarning?: string; // Custom warning message
  showStats?: boolean; // Show stats like members count, messages count
  stats?: {
    icon: string;
    label: string;
    value: string | number;
  }[];
  isDeleting?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  itemName,
  confirmText,
  customTitle,
  customWarning,
  showStats = false,
  stats = [],
  isDeleting = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'group':
        return {
          title: `Xóa nhóm`,
          titleHighlight: itemName,
          icon: 'fluent:people-team-delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này sẽ xóa vĩnh viễn nhóm và tất cả nội dung bên trong. Bạn không thể hoàn tác hành động này.',
        };
      case 'conversation':
        return {
          title: `Xóa cuộc trò chuyện với`,
          titleHighlight: itemName,
          icon: 'fluent:chat-delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này sẽ xóa vĩnh viễn cuộc trò chuyện và tất cả tin nhắn. Bạn không thể hoàn tác hành động này.',
        };
      case 'account':
        return {
          title: `Xóa tài khoản`,
          titleHighlight: itemName,
          icon: 'fluent:person-delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan. Bạn sẽ mất quyền truy cập vào tài khoản này mãi mãi.',
        };
      case 'post':
        return {
          title: `Xóa bài viết`,
          icon: 'fluent:delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này sẽ xóa vĩnh viễn bài viết và tất cả bình luận, lượt thích. Bạn không thể hoàn tác hành động này.',
        };
      case 'comment':
        return {
          title: `Xóa bình luận`,
          icon: 'fluent:comment-delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này sẽ xóa vĩnh viễn bình luận. Bạn không thể hoàn tác hành động này.',
        };
      case 'unfriend':
        return {
          title: `Hủy kết bạn với`,
          titleHighlight: `@${itemName}`,
          icon: 'fluent:person-subtract-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Bạn sẽ không còn là bạn bè với người này. Bạn có thể gửi lời mời kết bạn lại sau.',
          buttonText: 'Hủy kết bạn',
        };
      default:
        return {
          title: `Xóa`,
          titleHighlight: itemName,
          icon: 'fluent:delete-24-filled',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          warning: 'Hành động này không thể hoàn tác.',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const titleText = customTitle || defaultContent.title;
  const titleHighlight = 'titleHighlight' in defaultContent ? defaultContent.titleHighlight : undefined;
  const warning = customWarning || defaultContent.warning;
  const textToConfirm = confirmText || itemName;
  const buttonText = 'buttonText' in defaultContent ? defaultContent.buttonText : 'Xóa vĩnh viễn';
  const buttonIcon = type === 'unfriend' ? 'fluent:person-subtract-24-filled' : 'fluent:delete-24-filled';
  const processingText = type === 'unfriend' ? 'Đang hủy...' : 'Đang xóa...';
  
  // Post, Comment, Unfriend, and Custom don't need input confirmation
  const needsInputConfirmation = !['post', 'comment', 'unfriend', 'custom'].includes(type);

  const handleConfirm = async () => {
    // Skip input validation for post and comment
    if (needsInputConfirmation && inputValue !== textToConfirm) return;

    setIsProcessing(true);
    try {
      await onConfirm();
      handleClose();
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing && !isDeleting) {
      setInputValue('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const isConfirmEnabled = needsInputConfirmation 
    ? (inputValue === textToConfirm && !isProcessing && !isDeleting)
    : (!isProcessing && !isDeleting);

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start pr-8">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon icon="fluent:compass-northwest-24-regular" className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {titleText}
              {titleHighlight && (
                <span className="text-blue-600"> {titleHighlight}</span>
              )}
            </h2>
          </div>
          <button
            className="absolute flex items-center justify-center w-10 h-10 text-gray-600 rounded-full bg-gray-100 right-6 top-6 hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClose}
            disabled={isProcessing || isDeleting}
            aria-label="Đóng"
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {/* Icon - Show for all types */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${defaultContent.iconBg} flex items-center justify-center`}>
              <Icon icon={defaultContent.icon} className={`h-8 w-8 ${defaultContent.iconColor}`} />
            </div>
          </div>

          {/* Item Name - Use ExpandableContent for post type */}
          <div className="text-center mb-4">
            {type === 'post' ? (
              <div className="text-left">
                <ExpandableContent 
                  content={itemName} 
                  maxLines={3} 
                  className="text-sm text-gray-700 text-center"
                />
              </div>
            ) : (
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{itemName}</h3>
            )}
          </div>

          {/* Stats */}
          {showStats && stats.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6 pb-6 border-b border-gray-200">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <Icon icon={stat.icon} className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{stat.value} {stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warning Message */}
          <div className="mb-6">
            <div className="flex items-start space-x-2 mb-4 p-3 bg-red-50 rounded-lg">
              <Icon icon="fluent:warning-24-filled" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{warning}</p>
            </div>

            {needsInputConfirmation && (
              <>
                <p className="text-sm text-gray-700 mb-3">
                  Để xác nhận, vui lòng nhập{' '}
                  <span className="font-semibold text-gray-900 px-2 py-0.5 bg-gray-100 rounded">
                    {textToConfirm}
                  </span>{' '}
                  vào ô bên dưới:
                </p>
                <TravelInput
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={textToConfirm}
                  disabled={isProcessing || isDeleting}
                  className="mb-0"
                />
                {inputValue && inputValue !== textToConfirm && (
                  <p className="text-xs text-red-600 mt-2 flex items-center space-x-1">
                    <Icon icon="fluent:error-circle-24-filled" className="h-3.5 w-3.5" />
                    <span>Tên không khớp. Vui lòng nhập chính xác.</span>
                  </p>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items sm:flex-row gap-3 items-center justify-end">
            <TravelButton
              type="default"
              onClick={handleClose}
              disabled={isProcessing || isDeleting}
              className="order-2 sm:order-1 !bg-gray-100 hover:!bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </TravelButton>
            <TravelButton
              type="primary"
              danger={true}
              onClick={handleConfirm}
              disabled={!isConfirmEnabled}
              loading={isProcessing || isDeleting}
              className="order-1 sm:order-2"
            >
              {isProcessing || isDeleting ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size={16} color="#FFFFFF" />
                  <span>{processingText}</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <Icon icon={buttonIcon} className="w-5 h-5 mr-2" />
                  {buttonText}
                </span>
              )}
            </TravelButton>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmDeleteModal;
