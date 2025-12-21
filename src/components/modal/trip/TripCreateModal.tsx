import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { TravelInput, TravelButton } from '../../ui/customize';
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
}

const TripCreateModal: React.FC<TripCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editTrip
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
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

  const [conversations, setConversations] = useState<ConversationOption[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load conversations
  useEffect(() => {
    if (isOpen && currentUser?.userId) {
      loadConversations();
    }
  }, [isOpen, currentUser?.userId]);

  // Load edit data
  useEffect(() => {
    if (editTrip) {
      setFormData({
        conversationId: editTrip.conversationId,
        tripName: editTrip.tripName,
        tripDescription: editTrip.tripDescription || '',
        coverImageUrl: editTrip.coverImageUrl || '',
        destination: editTrip.destination || '',
        startDate: editTrip.startDate.split('T')[0], // Convert to YYYY-MM-DD
        endDate: editTrip.endDate.split('T')[0],
        budget: editTrip.budget || undefined,
        status: editTrip.status
      });
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
          .filter(conv => conv.type === 'GROUP') // Only show group conversations
          .map(conv => ({
            conversationId: conv.conversationId,
            conversationName: conv.conversationName || 'Nhóm chat',
            conversationAvatar: conv.conversationAvatar
          }));
        setConversations(options);
      }
    } catch (error: any) {
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

      // Convert dates to ISO format
      const submitData: TripDto = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
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
    } catch (error: any) {
      console.error('Error submitting trip:', error);
      toast.error(error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {editTrip ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <Icon icon="fluent:dismiss-24-filled" className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Conversation Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhóm chat <span className="text-red-500">*</span>
            </label>
            {loadingConversations ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <select
                value={formData.conversationId}
                onChange={(e) => handleInputChange('conversationId', e.target.value)}
                disabled={!!editTrip} // Can't change conversation when editing
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.conversationId ? 'border-red-500' : 'border-gray-300'
                } ${editTrip ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Chọn nhóm chat</option>
                {conversations.map(conv => (
                  <option key={conv.conversationId} value={conv.conversationId}>
                    {conv.conversationName}
                  </option>
                ))}
              </select>
            )}
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
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
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
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as TripStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PLANNING">Đang lên kế hoạch</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="ONGOING">Đang diễn ra</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
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

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL ảnh bìa
            </label>
            <TravelInput
              type="url"
              value={formData.coverImageUrl || ''}
              onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <TravelButton
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </TravelButton>
            <TravelButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
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
};

export default TripCreateModal;
