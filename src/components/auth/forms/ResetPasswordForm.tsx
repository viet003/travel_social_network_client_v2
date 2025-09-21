import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { apiResetPasswordService } from '../../../services/authService';
import { path } from '../../../utilities/path';
import { GoogleLoginButton, FacebookLoginButton } from '../buttons';
import { TravelInput, TravelButton } from '../../common/inputs';
import { background } from '../../../assets/images';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const navigate = useNavigate();

  const handleSocialError = (error: string) => {
    setError(error);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
        {/* Left Side - Content */}
        <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left order-first lg:col-span-2">
          {/* Success Icon and Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-bold text-[var(--travel-primary-500)] leading-tight text-left max-w-md">
              Thành công!
            </h1>
          </div>

          <p className="text-base sm:text-md max-w-md font-[400] text-gray-500 space-y-2">
            Mật khẩu của bạn đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây.
          </p>

          <div className="space-y-4 w-full max-w-md">
            <Link to={path.LANDING}>
              <TravelButton type="primary" className="w-full">
                Đăng nhập ngay
              </TravelButton>
            </Link>
          </div>
        </div>

        {/* Right Side - Background Image (3/5) */}
        <div className="relative h-full order-last w-full flex justify-center lg:col-span-3">
          <div className="relative z-10 rounded-3xl overflow-hidden w-full">
            {imageLoading ? (
              <Skeleton.Image 
                active 
                style={{ width: '100%', height: '600px' }}
                className="rounded-3xl"
              />
            ) : null}
            <img
              src={background}
              alt="Social Network"
              className={`w-full h-auto rounded-3xl object-cover ${imageLoading ? 'hidden' : 'block'}`}
              onLoad={handleImageLoad}
            />
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400 rounded-full opacity-20"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 -right-12 w-16 h-16 bg-indigo-400 rounded-full opacity-30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
      {/* Left Side - Content */}
      <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left order-first lg:col-span-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-bold text-[var(--travel-primary-500)] leading-tight text-left max-w-md">
          Đặt lại mật khẩu
        </h1>

        <p className="text-base sm:text-md max-w-md font-[400] text-gray-500 space-y-2">
          Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật khẩu.
        </p>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <TravelInput
              type="password"
              placeholder="Mật khẩu mới * (8-15 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              maxLength={15}
            />

            <TravelInput
              type="password"
              placeholder="Xác nhận mật khẩu mới *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={15}
            />
          </div>

          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500">Mật khẩu xác nhận không khớp</p>
          )}

          <TravelButton
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading || !token}
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </TravelButton>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <GoogleLoginButton
              onError={handleSocialError}
              buttonText="Đăng nhập bằng Google"
              loadingText="Đang xử lý..."
            />
            <FacebookLoginButton
              onError={handleSocialError}
              buttonText="Đăng nhập bằng Facebook"
              loadingText="Đang xử lý..."
            />
          </div>

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

      {/* Right Side - Background Image (3/5) */}
      <div className="relative h-full order-last w-full flex justify-center lg:col-span-3">
        <div className="relative z-10 rounded-3xl overflow-hidden w-full">
          {imageLoading ? (
            <Skeleton.Image 
              active 
              style={{ width: '100%', height: '600px' }}
              className="rounded-3xl"
            />
          ) : null}
          <img
            src={background}
            alt="Social Network"
            className={`w-full h-auto rounded-3xl object-cover ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 -right-12 w-16 h-16 bg-indigo-400 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
