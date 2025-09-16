import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiResetPasswordService } from '../../services/authService';
import { path } from '../../utilities/path';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 15) {
      setError('Mật khẩu phải có từ 8-15 ký tự');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Token không hợp lệ');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiResetPasswordService(token, {
        newPassword,
        newPasswordConfirm: confirmPassword
      });
      
      if (response?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(response?.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (error: any) {
      setError(error?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* Success Icon and Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-travel-gradient leading-tight">
            Thành công!
          </h1>
        </div>

        <p className="text-gray-600 text-base sm:text-lg max-w-md">
          Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây.
        </p>

        <div className="space-y-4 w-full max-w-md">
          <Link 
            to={path.LANDING}
            className="bg-travel-gradient text-white px-6 py-2 text-sm rounded-xl font-medium hover:bg-travel-gradient-dark hover:scale-105 hover:shadow-lg transition-all duration-300 w-full cursor-pointer transform inline-block text-center"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-travel-gradient leading-tight">
        Đặt lại mật khẩu
      </h1>

      <p className="text-gray-600 text-base sm:text-lg max-w-md">
        Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật khẩu.
      </p>

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="Mật khẩu mới * (8-15 ký tự)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          maxLength={15}
          className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-500"
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          maxLength={15}
          className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-500"
        />

        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-500">Mật khẩu xác nhận không khớp</p>
        )}

        <button 
          type="submit"
          disabled={isLoading || !token}
          className="bg-travel-gradient text-white px-6 py-2 text-sm rounded-xl font-medium hover:bg-travel-gradient-dark hover:scale-105 hover:shadow-lg transition-all duration-300 w-full cursor-pointer transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Nhớ lại mật khẩu?{' '}
            <Link to={path.LANDING} className="text-[var(--travel-primary-600)] font-medium cursor-pointer transition-all duration-200 hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
