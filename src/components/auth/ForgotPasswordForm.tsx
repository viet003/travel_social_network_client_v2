import { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-travel-gradient leading-tight">
          Email đã được gửi!
        </h1>

        <p className="text-gray-600 text-base sm:text-lg max-w-md">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến địa chỉ email của bạn. 
          Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
        </p>

        <div className="space-y-4 w-full max-w-md">
          <button 
            onClick={() => setIsEmailSent(false)}
            className="bg-travel-gradient text-white px-6 py-2 text-sm rounded-md font-medium hover:bg-travel-gradient-dark hover:scale-105 hover:shadow-lg transition-all duration-300 w-full cursor-pointer transform"
          >
            Gửi lại email
          </button>
          
          <p className="text-center text-xs text-gray-500">
            Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
            <a href="#" className="text-travel-primary-600 hover:underline cursor-pointer">
              liên hệ hỗ trợ
            </a>
          </p>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Tải về từ</div>
              <div className="font-medium text-sm">App Store</div>
            </div>
          </button>

          <button className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
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
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-travel-gradient leading-tight">
        Quên mật khẩu?
      </h1>

      <p className="text-gray-600 text-base sm:text-lg max-w-md">
        Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
      </p>

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />

        <button 
          type="submit"
          className="bg-travel-gradient text-white px-6 py-2 text-sm rounded-md font-medium hover:bg-travel-gradient-dark hover:scale-105 hover:shadow-lg transition-all duration-300 w-full cursor-pointer transform"
        >
          Gửi hướng dẫn khôi phục
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Google Login */}
        <button className="w-full max-w-md bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium">Đăng nhập bằng Google</span>
        </button>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Nhớ lại mật khẩu?{' '}
            <a href="/" className="text-travel-primary-600 hover:underline cursor-pointer">
              Đăng nhập ngay
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Chưa có tài khoản?{' '}
            <a href="/signup" className="text-travel-primary-600 hover:underline cursor-pointer">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </form>

      {/* App Store Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="text-left">
            <div className="text-xs">Tải về từ</div>
            <div className="font-medium text-sm">App Store</div>
          </div>
        </button>

        <button className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer transform">
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
  );
};

export default ForgotPasswordForm;
