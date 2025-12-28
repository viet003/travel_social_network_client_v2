import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Skeleton } from 'antd';
import { authAction } from '../../../stores/actions';
import { path } from '../../../utilities/path';
import { GoogleLoginButton, FacebookLoginButton } from '../buttons';
import { TravelInput, TravelButton, TravelCheckbox } from '../../ui/customize';
import { LoadingSpinner } from '../../ui/loading';
import  travel_vietnam  from '../../../assets/images/travel_vietnam.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await dispatch(authAction.login({ email, password }) as any);
      if (response?.success) {
        navigate(path.HOME);
      } else {
        setError(response?.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      setError(error?.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
      {/* Left Side - Content (2/5) */}
      <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left order-first lg:col-span-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-bold text-[var(--travel-primary-500)] leading-tight text-left max-w-md">
          Kết nối, khám phá
          và chia sẻ<br />
          những chuyến<br />
          đi đáng nhớ
        </h1>

        <p className="text-base sm:text-md max-w-md font-[400] text-gray-500 space-y-2">
          Với TravelNest, bạn có thể kết nối với những người cùng đam mê du lịch, chia sẻ kinh nghiệm và tạo ra những kỷ niệm không thể quên.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <TravelInput
              type="email"
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TravelInput
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center space-x-2">
              <TravelCheckbox
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              >
                Duy trì đăng nhập
              </TravelCheckbox>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <TravelButton
              type="primary"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size={16} color="#FFFFFF" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "Đăng nhập"
              )}
            </TravelButton>
            <Link to={path.FORGOTPASS} className="text-gray-500 text-xs text-center sm:text-right font-medium cursor-pointer hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4 hover:text-[var(--travel-primary-700)]">
              Bạn quên mật khẩu?
            </Link>
          </div>

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
            />
            <FacebookLoginButton 
              onError={handleSocialError}
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Chưa có tài khoản?{' '}
              <Link to={path.SIGNUP} className="mt-3 text-[var(--travel-primary-600)] font-medium cursor-pointer transition-all duration-200 hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button className="bg-black text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Tải về từ</div>
              <div className="font-medium text-sm">App Store</div>
            </div>
          </button>

          <button className="bg-black text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Tải về từ</div>
              <div className="font-medium text-sm">Microsoft</div>
            </div>
          </button>
        </div>
      </div>

      {/* Right Side - Background Image (3/5) */}
      <div className="relative h-full order-last w-full flex justify-center lg:col-span-3">
        <div className="relative z-10 rounded-3xl overflow-hidden w-full">
          {imageLoading ? (
            <Skeleton.Image 
              active 
              className="!w-full !h-[500px] sm:!w-full sm:!h-[550px] md:!w-full md:!h-[600px] rounded-3xl"
            />
          ) : null}
          <img
            src={travel_vietnam}
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

    </>
  );
};

export default LoginForm;
