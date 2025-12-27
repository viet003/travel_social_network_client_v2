import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { TravelButton, TravelInput, TravelDatePicker, TravelTimePicker } from '../../ui/customize';
import { toast } from 'react-toastify';
import { apiCreateSchedule, apiUpdateSchedule } from '../../../services/tripService';
import type { TripScheduleResponse, TripScheduleDto, ActivityType } from '../../../types/trip.types';

interface TripScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (schedule: TripScheduleResponse) => void;
  tripId: string;
  editSchedule?: TripScheduleResponse | null;
}

const activityTypeOptions: { value: ActivityType; label: string; icon: string; color: string }[] = [
  { value: 'VISIT', label: 'Tham quan', icon: 'fluent:camera-24-regular', color: 'text-purple-600' },
  { value: 'MEAL', label: 'Ăn uống', icon: 'fluent:food-24-regular', color: 'text-orange-600' },
  { value: 'ACCOMMODATION', label: 'Lưu trú', icon: 'fluent:bed-24-regular', color: 'text-blue-600' },
  { value: 'TRANSPORT', label: 'Di chuyển', icon: 'fluent:vehicle-bus-24-regular', color: 'text-green-600' },
  { value: 'OTHER', label: 'Khác', icon: 'fluent:star-24-regular', color: 'text-gray-600' }
];

const TripScheduleModal: React.FC<TripScheduleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tripId,
  editSchedule
}) => {
  const [formData, setFormData] = useState<Omit<TripScheduleDto, 'tripId'>>({
    title: '',
    description: '',
    location: '',
    scheduleDate: '',
    startTime: '',
    endTime: '',
    activityType: 'VISIT',
    estimatedCost: undefined,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load edit data
  useEffect(() => {
    if (editSchedule) {
      const scheduleDate = editSchedule.scheduleDate.split('T')[0]; // YYYY-MM-DD
      const startTime = editSchedule.startTime ? new Date(editSchedule.startTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : '';
      const endTime = editSchedule.endTime ? new Date(editSchedule.endTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : '';

      setFormData({
        title: editSchedule.title,
        description: editSchedule.description || '',
        location: editSchedule.location || '',
        scheduleDate,
        startTime,
        endTime,
        activityType: (editSchedule.activityType as ActivityType) || 'VISIT',
        estimatedCost: editSchedule.estimatedCost || undefined,
        notes: editSchedule.notes || ''
      });
    } else {
      resetForm();
    }
  }, [editSchedule, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      scheduleDate: '',
      startTime: '',
      endTime: '',
      activityType: 'VISIT',
      estimatedCost: undefined,
      notes: ''
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên hoạt động';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Tên hoạt động không được vượt quá 255 ký tự';
    }

    if (!formData.scheduleDate) {
      newErrors.scheduleDate = 'Vui lòng chọn ngày';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
      }
    }

    if (formData.estimatedCost !== undefined && formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'Chi phí không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time into ISO format
      const startDateTime = new Date(`${formData.scheduleDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.scheduleDate}T${formData.endTime}`).toISOString();

      const scheduleDto: TripScheduleDto = {
        tripId,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        scheduleDate: new Date(formData.scheduleDate).toISOString(),
        startTime: startDateTime,
        endTime: endDateTime,
        activityType: formData.activityType,
        estimatedCost: formData.estimatedCost || undefined,
        notes: formData.notes?.trim() || undefined
      };

      const response = editSchedule
        ? await apiUpdateSchedule(editSchedule.tripScheduleId, scheduleDto)
        : await apiCreateSchedule(scheduleDto);

      if (response.success && response.data) {
        toast.success(editSchedule ? 'Đã cập nhật hoạt động' : 'Đã tạo hoạt động');
        onSuccess?.(response.data);
        handleClose();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể lưu hoạt động';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | ActivityType | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex flex-col items-start pr-8">
              <span className="flex items-center mb-1 text-base sm:text-lg font-bold text-blue-600">
                <Icon icon="fluent:calendar-ltr-24-filled" className="text-blue-600 w-4 h-4 sm:w-6 sm:h-6 mr-2" />
                TravelNest Trip
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editSchedule ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                {editSchedule ? 'Cập nhật thông tin cho hoạt động' : 'Tạo lịch trình chi tiết cho chuyến đi'}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 pb-24 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Activity Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Loại hoạt động <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {activityTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('activityType', option.value)}
                    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      formData.activityType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <Icon icon={option.icon} className={`w-6 h-6 ${option.color}`} />
                    <span className="text-xs font-medium text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên hoạt động <span className="text-red-500">*</span>
              </label>
              <TravelInput
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="VD: Tham quan Hồ Xuân Hương"
                disabled={isSubmitting}
                error={errors.title}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Mô tả chi tiết hoạt động..."
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Địa điểm
              </label>
              <div className="relative">
                {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Icon icon="fluent:location-24-regular" className="w-5 h-5" />
                </div> */}
                <TravelInput
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="VD: Hồ Xuân Hương, Đà Lạt"
                  disabled={isSubmitting}
                  error={errors.location}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <TravelDatePicker
                  value={formData.scheduleDate}
                  onChange={(date) => handleChange('scheduleDate', date)}
                  placeholder="Chọn ngày"
                  disabled={isSubmitting}
                  format="DD/MM/YYYY"
                  className={errors.scheduleDate ? 'border-red-500' : ''}
                />
                {errors.scheduleDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.scheduleDate}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ bắt đầu <span className="text-red-500">*</span>
                </label>
                <TravelTimePicker
                  value={formData.startTime}
                  onChange={(time) => handleChange('startTime', time)}
                  placeholder="Chọn giờ bắt đầu"
                  disabled={isSubmitting}
                  error={errors.startTime}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ kết thúc <span className="text-red-500">*</span>
                </label>
                <TravelTimePicker
                  value={formData.endTime}
                  onChange={(time) => handleChange('endTime', time)}
                  placeholder="Chọn giờ kết thúc"
                  disabled={isSubmitting}
                  error={errors.endTime}
                />
              </div>
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chi phí dự kiến (VNĐ)
              </label>
              <div className="relative">
                {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Icon icon="fluent:money-24-regular" className="w-5 h-5" />
                </div> */}
                <TravelInput
                  type="number"
                  value={formData.estimatedCost || ''}
                  onChange={(e) => handleChange('estimatedCost', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  disabled={isSubmitting}
                  error={errors.estimatedCost}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Ghi chú thêm về hoạt động..."
                disabled={isSubmitting}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <TravelButton
            type="default"
            htmlType="button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </TravelButton>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon icon="fluent:spinner-ios-20-regular" className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>{editSchedule ? 'Cập nhật' : 'Tạo hoạt động'}</span>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TripScheduleModal;
