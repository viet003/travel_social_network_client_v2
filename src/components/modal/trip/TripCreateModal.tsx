import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { TravelInput, TravelButton, TravelSelect, TravelDatePicker } from '../../ui/customize';
import { ConversationSelectDropdown } from '../../common/dropdowns';
import { toast } from 'react-toastify';
import { apiCreateTrip, apiUpdateTrip } from '../../../services/tripService';
import { apiGetUserConversations } from '../../../services/conversationService';
import { LoadingSpinner } from '../../ui/loading';
import type { TripResponse, TripDto, TripStatus } from '../../../types/trip.types';
import type { RootState } from '../../../stores/types/storeTypes';

interface TripCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (trip: TripResponse) => void;
  editTrip?: TripResponse | null;
}

interface ConversationOption {
  conversationId: string;
  conversationName: string;
  conversationAvatar: string | null;
  lastActive?: string;
}

const TripCreateModal: React.FC<TripCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editTrip
}) => {
  const currentUserId = useSelector((state: RootState) => state.auth.userId);
  
  const [formData, setFormData] = useState<TripDto>({
    conversationId: '',
    tripName: '',
    tripDescription: '',
    coverImageUrl: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: undefined,
    status: 'PLANNING'
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationOption[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load conversations
  useEffect(() => {
    if (isOpen && currentUserId) {
      loadConversations();
    }
  }, [isOpen, currentUserId]);

  // Load edit data
  useEffect(() => {
    if (editTrip) {
      setFormData({
        conversationId: editTrip.conversation.conversationId,
        tripName: editTrip.tripName,
        tripDescription: editTrip.tripDescription || '',
        coverImageUrl: editTrip.coverImageUrl || '',
        destination: editTrip.destination || '',
        startDate: editTrip.startDate.split('T')[0], // Convert to YYYY-MM-DD
        endDate: editTrip.endDate.split('T')[0],
        budget: editTrip.budget || undefined,
        status: editTrip.status
      });
      
      // Set existing cover image preview if available
      if (editTrip.coverImageUrl) {
        setCoverImagePreview(editTrip.coverImageUrl);
      }
    } else {
      resetForm();
    }
  }, [editTrip]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await apiGetUserConversations(0, 50);
      
      if (response.success && response.data) {
        const options = response.data.content
          .filter(conv => conv.type === 'GROUP') 
          .map(conv => ({
            conversationId: conv.conversationId,
            conversationName: conv.conversationName || 'Nhóm chat',
            conversationAvatar: conv.conversationAvatar,
            lastActive: conv.lastActiveAt || undefined
          }));
        setConversations(options);
      }
    } catch (error: unknown) {
      console.error('Error loading conversations:', error);
      toast.error('Không thể tải danh sách nhóm chat');
    } finally {
      setLoadingConversations(false);
    }
  };

  const resetForm = () => {
    setFormData({
      conversationId: '',
      tripName: '',
      tripDescription: '',
      coverImageUrl: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: undefined,
      status: 'PLANNING'
    });
    setCoverImage(null);
    setCoverImagePreview(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.conversationId.trim()) {
      newErrors.conversationId = 'Vui lòng chọn nhóm chat';
    }

    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Vui lòng nhập tên lịch trình';
    } else if (formData.tripName.length > 255) {
      newErrors.tripName = 'Tên lịch trình không được vượt quá 255 ký tự';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure conversationId exists
      if (!formData.conversationId) {
        throw new Error('Vui lòng chọn nhóm chat');
      }

      // Convert dates to ISO format and create properly typed object
      const submitData: TripDto & { coverImage?: File } = {
        conversationId: formData.conversationId,
        tripName: formData.tripName,
        tripDescription: formData.tripDescription || undefined,
        destination: formData.destination || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budget: formData.budget,
        status: formData.status,
        coverImageUrl: formData.coverImageUrl,
        coverImage: coverImage || undefined
      };

      let response;
      if (editTrip) {
        response = await apiUpdateTrip(editTrip.tripId, submitData);
        toast.success('Cập nhật lịch trình thành công!');
      } else {
        response = await apiCreateTrip(submitData);
        toast.success('Tạo lịch trình thành công!');
      }

      if (response.success && response.data) {
        onSuccess?.(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting trip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (
    field: keyof TripDto,
    value: string | number | undefined
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Hình ảnh quá lớn! Vui lòng chọn hình ảnh nhỏ hơn 5MB.');
      return;
    }

    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 h-[100vh] flex items-center justify-center bg-black/50 p-4"
      style={{ zIndex: 9999 }}
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex flex-col items-start pr-8">
              <span className="flex items-center mb-1 text-base sm:text-lg font-bold text-blue-600">
                <Icon icon="fluent:calendar-ltr-24-filled" className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6 mr-2" />
                TravelNest Trip
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editTrip ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                {editTrip ? 'Cập nhật thông tin cho chuyến đi của bạn' : 'Lên kế hoạch cho chuyến du lịch tiếp theo'}
              </p>
            </div>
            <button
              className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-4 sm:right-5 top-4 sm:top-5 hover:bg-gray-300 transition-colors cursor-pointer"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Đóng"
            >
              <Icon icon="fluent:dismiss-24-filled" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Conversation Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm chat <span className="text-red-500">*</span>
            </label>
            <ConversationSelectDropdown
              value={formData.conversationId}
              onChange={(value) => handleInputChange('conversationId', value)}
              options={conversations}
              placeholder="Chọn nhóm chat"
              disabled={!!editTrip}
              error={!!errors.conversationId}
              loading={loadingConversations}
            />
            {errors.conversationId && (
              <p className="text-red-500 text-sm mt-1">{errors.conversationId}</p>
            )}
          </div>

          {/* Trip Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên lịch trình <span className="text-red-500">*</span>
            </label>
            <TravelInput
              type="text"
              value={formData.tripName}
              onChange={(e) => handleInputChange('tripName', e.target.value)}
              placeholder="Ví dụ: Du lịch Đà Nẵng 5 ngày 4 đêm"
              error={errors.tripName}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm đến
            </label>
            <TravelInput
              type="text"
              value={formData.destination || ''}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Ví dụ: Đà Nẵng, Hội An, Huế"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <TravelDatePicker
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <TravelDatePicker
                value={formData.endDate}
                onChange={(date) => handleInputChange('endDate', date)}
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngân sách (VNĐ)
            </label>
            <TravelInput
              type="number"
              value={formData.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ví dụ: 10000000"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <TravelSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value as TripStatus)}
              placeholder="Chọn trạng thái"
              options={[
                { value: 'PLANNING', label: 'Đang lên kế hoạch' },
                { value: 'CONFIRMED', label: 'Đã xác nhận' },
                { value: 'ONGOING', label: 'Đang diễn ra' },
                { value: 'COMPLETED', label: 'Đã hoàn thành' },
                { value: 'CANCELLED', label: 'Đã hủy' }
              ]}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.tripDescription || ''}
              onChange={(e) => handleInputChange('tripDescription', e.target.value)}
              placeholder="Mô tả chi tiết về chuyến đi..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh bìa
            </label>
            {!coverImagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center py-4">
                  <Icon icon="fluent:image-add-24-filled" className="w-12 h-12 mb-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Tải lên ảnh bìa</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG • Tối đa 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-40 border border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Icon icon="fluent:delete-24-filled" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <TravelButton
              type="default"
              htmlType="button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </TravelButton>
            <TravelButton
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  {editTrip ? 'Đang cập nhật...' : 'Đang tạo...'}
                </span>
              ) : (
                editTrip ? 'Cập nhật' : 'Tạo lịch trình'
              )}
            </TravelButton>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TripCreateModal;
