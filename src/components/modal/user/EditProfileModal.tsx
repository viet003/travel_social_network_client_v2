import { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { TravelSelect, TravelInput, TravelDatePicker, TravelButton } from '../../ui/customize';

interface FormData {
  userName: string;
  firstName: string;
  lastName: string;
  location: string;
  gender: string;
  dateOfBirth: string;
  about: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  location?: string;
  gender?: string;
  dateOfBirth?: string;
  about?: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => Promise<void> | void;
  initialValues?: {
    userName?: string;
    userProfile?: UserProfile;
  };
}

const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialValues = {} 
}) => {
  const [form, setForm] = useState<FormData>({
    userName: "",
    firstName: "",
    lastName: "",
    location: "",
    gender: "",
    dateOfBirth: "",
    about: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        userName: initialValues.userName || "",
        firstName: initialValues.userProfile?.firstName || "",
        lastName: initialValues.userProfile?.lastName || "",
        location: initialValues.userProfile?.location || "",
        gender: initialValues.userProfile?.gender || "",
        dateOfBirth: initialValues.userProfile?.dateOfBirth || "",
        about: initialValues.userProfile?.about || "",
      });
    }
  }, [open, initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit?.(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      userName: "",
      firstName: "",
      lastName: "",
      location: "",
      gender: "",
      dateOfBirth: "",
      about: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ease-in-out bg-black/50"
      style={{ zIndex: 1000 }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col items-start">
            <span className="flex items-center mb-2 text-xl font-bold text-blue-600">
              <Icon icon="mdi:compass" className="text-blue-600 w-7 h-7" />
              TravelNest
            </span>
            <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa hồ sơ</h2>
            <p className="text-sm text-gray-500">Cập nhật thông tin cá nhân và sở thích của bạn</p>
          </div>
          <button
            className="absolute flex items-center justify-center w-8 h-8 text-gray-600 rounded-full bg-gray-white right-6 top-6 hover:bg-gray-300 cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Họ <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Nhập họ của bạn"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên người dùng <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  value={form.userName}
                  onChange={(e) => setForm((prev) => ({ ...prev, userName: e.target.value }))}
                  placeholder="Nhập tên người dùng"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Giới tính</label>
                <TravelSelect
                  placeholder="Chọn giới tính"
                  value={form.gender}
                  onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
                  options={GENDER_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin bổ sung</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Ngày sinh</label>
                <TravelDatePicker
                  placeholder="Chọn ngày sinh"
                  value={form.dateOfBirth}
                  onChange={(date) => setForm((prev) => ({ ...prev, dateOfBirth: date }))}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Địa điểm</label>
                <TravelInput
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Nhập địa điểm..."
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Giới thiệu về bản thân <span className="text-xs text-gray-500">(Tùy chọn)</span>
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              placeholder="Hãy kể về bản thân, sở thích du lịch, điểm đến yêu thích..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">{form.about.length}/500 ký tự</p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <TravelButton
                type="default"
                htmlType="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Hủy
              </TravelButton>
              <TravelButton
                type="primary"
                htmlType="submit"
                disabled={isSubmitting || !form.firstName.trim() || !form.lastName.trim() || !form.userName.trim()}
                loading={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </TravelButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
