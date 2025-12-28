import { useState } from "react";
import { Icon } from '@iconify/react';
import { TravelInput, TravelButton, TravelSelect } from '../ui/customize';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateUserFormData {
  email: string;
  userName: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ 
  open, 
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    userName: "",
    password: "",
    role: 'USER',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);

    try {
      const { apiAdminCreateUser } = await import('../../services/adminDashboardService');
      await apiAdminCreateUser(formData);
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? (err as { message: string }).message 
        : 'Có lỗi xảy ra khi tạo tài khoản';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      userName: "",
      password: "",
      role: 'USER',
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
        className="relative w-full max-w-2xl bg-white shadow-lg transition-all duration-300 ease-in-out rounded-xl overflow-hidden"
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
            <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản mới</h2>
            <p className="text-sm text-gray-500">Thêm người dùng mới vào hệ thống</p>
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

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6">
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

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <TravelInput
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
                minLength={8}
                maxLength={15}
              />
              <p className="mt-1 text-xs text-gray-500">
                Mật khẩu phải có từ 8-15 ký tự
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <TravelSelect
                placeholder="Chọn vai trò"
                value={formData.role}
                onChange={(value) => setFormData((prev) => ({ ...prev, role: value as 'USER' | 'ADMIN' | 'MODERATOR' }))}
                options={[
                  { value: 'USER', label: 'User - Người dùng' },
                  { value: 'ADMIN', label: 'Admin - Quản trị viên' },
                  { value: 'MODERATOR', label: 'Moderator - Kiểm duyệt viên' },
                ]}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 space-x-3 border-t border-gray-200">
            <TravelButton
              type="default"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </TravelButton>
            <TravelButton
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Tạo tài khoản
            </TravelButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
