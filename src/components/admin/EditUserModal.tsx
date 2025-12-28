import { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { TravelInput, TravelButton } from '../ui/customize';
import { apiAdminUpdateUser, type AdminUpdateUserData } from '../../services/adminDashboardService';
import type { RecentUser } from '../../types/adminDashboard.types';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: RecentUser | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  open, 
  onClose,
  onSuccess,
  user
}) => {
  const [formData, setFormData] = useState<AdminUpdateUserData>({
    email: "",
    userName: "",
    fullName: "",
    location: "",
    about: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      setFormData({
        email: user.email || "",
        userName: user.userName || "",
        fullName: "",
        location: "",
        about: "",
      });
      setError(null);
    }
  }, [open, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await apiAdminUpdateUser(user.userId, formData);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi cập nhật người dùng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      userName: "",
      fullName: "",
      location: "",
      about: "",
    });
    setError(null);
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
            <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin người dùng</h2>
            <p className="text-sm text-gray-500">Cập nhật thông tin tài khoản người dùng</p>
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
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên người dùng <span className="text-red-500">*</span>
                </label>
                <TravelInput
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
                  placeholder="username"
                  required
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <TravelInput
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Địa điểm
                </label>
                <TravelInput
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Hà Nội, Việt Nam"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Giới thiệu <span className="text-xs text-gray-500">(Tùy chọn)</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
              placeholder="Thông tin giới thiệu về người dùng..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.about?.length || 0}/500 ký tự</p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <TravelButton
                type="default"
                htmlType="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 !bg-gray-100 hover:!bg-gray-200 transition-colors"
              >
                Hủy
              </TravelButton>
              <TravelButton
                type="primary"
                htmlType="submit"
                disabled={isSubmitting || !formData.email?.trim() || !formData.userName?.trim()}
                loading={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon icon="mdi:content-save" className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </div>
                )}
              </TravelButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
