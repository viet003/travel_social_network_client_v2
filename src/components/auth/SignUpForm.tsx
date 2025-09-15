import { useState } from 'react';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-travel-gradient leading-tight">
        Tham gia cộng đồng
        du lịch
        và tạo ra những
        kỷ niệm đáng nhớ
      </h1>

      <p className="text-gray-600 text-base sm:text-lg max-w-md">
        Tạo tài khoản miễn phí và bắt đầu hành trình khám phá thế giới cùng những người bạn đồng hành tuyệt vời.
      </p>

      {/* Sign Up Form */}
      <div className="space-y-3 w-full max-w-md">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Họ"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
          <input
            type="text"
            placeholder="Tên"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
        </div>

        <input
          type="email"
          placeholder="Email hoặc số điện thoại"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />

        <button className="bg-travel-gradient text-white px-6 py-2 text-sm rounded-md font-medium hover:bg-travel-gradient-dark hover:scale-105 hover:shadow-lg transition-all duration-300 w-full cursor-pointer transform">
          Tạo tài khoản
        </button>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-3 h-3 text-travel-primary-600 border-gray-300 rounded focus:ring-travel-primary-500 mt-0.5"
          />
          <label htmlFor="agreeToTerms" className="text-xs text-gray-500 leading-relaxed">
            Tôi đồng ý với{' '}
            <a href="#" className="text-travel-primary-600 hover:underline cursor-pointer">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-travel-primary-600 hover:underline cursor-pointer">
              Chính sách quyền riêng tư
            </a>
          </label>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Đã có tài khoản?{' '}
            <a href="/" className="text-travel-primary-600 hover:underline cursor-pointer">
              Đăng nhập ngay
            </a>
          </p>
        </div>
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
};

export default SignUpForm;
