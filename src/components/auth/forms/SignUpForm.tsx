import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAction } from '../../../stores/actions';
import { path } from '../../../utilities/path';
import { GoogleLoginButton, FacebookLoginButton } from '../buttons';
import { TravelInput, TravelButton, TravelCheckbox, TravelSelect, TravelDatePicker } from '../../common/inputs';
import { background } from '../../../assets/images';

const SignUpForm = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSocialError = (error: string) => {
    setError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Vui lòng đồng ý với điều khoản dịch vụ');
      setIsLoading(false);
      return;
    }

    try {
      const response = await dispatch(authAction.register({
        userName,
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined
      }) as any);

      if (response?.success) {
        navigate('/main');
      } else {
        setError(response?.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      setError(error?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
      {/* Left Side - Content */}
      <div className="space-y-6 lg:space-y-8 w-full flex flex-col items-center lg:items-start text-center lg:text-left order-first">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-bold text-[var(--travel-primary-500)] leading-tight text-left max-w-md">
          Tham gia cộng đồng
          du lịch<br/>
          và tạo ra những
          kỷ niệm đáng nhớ
        </h1>

        <p className="text-base sm:text-md max-w-md font-[400] text-gray-500 space-y-2">
          Tạo tài khoản miễn phí và bắt đầu hành trình khám phá thế giới cùng những người bạn đồng hành tuyệt vời.
        </p>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Username - Required */}
            <TravelInput
              type="text"
              placeholder="Tên đăng nhập *"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <TravelInput
                type="text"
                placeholder="Họ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={50}
              />
              <TravelInput
                type="text"
                placeholder="Tên"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Email - Required */}
            <TravelInput
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password - Required with validation */}
            <div className="space-y-1">
              <TravelInput
                type="password"
                placeholder="Mật khẩu * (8-15 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={15}
              />
              {password && (password.length < 8 || password.length > 15) && (
                <p className="text-xs text-red-500">Mật khẩu phải có từ 8-15 ký tự</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <TravelInput
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Mật khẩu xác nhận không khớp</p>
              )}
            </div>

            {/* Date of Birth */}
            <TravelDatePicker
              placeholder="Ngày sinh"
              value={dateOfBirth}
              onChange={setDateOfBirth}
            />

            {/* Gender */}
            <TravelSelect
              placeholder="Chọn giới tính"
              value={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' }
              ]}
            />

            <div className="flex items-start space-x-2">
              <TravelCheckbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              >
                <span className="text-xs text-gray-500 leading-relaxed">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-[var(--travel-primary-600)] font-medium cursor-pointer transition-all duration-200 hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4"
                  style={{
                    textDecoration: 'underline',
                    color: 'var(--travel-primary-600)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  >
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-[var(--travel-primary-600)] font-medium cursor-pointer transition-all duration-200 hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4"
                  style={{
                    textDecoration: 'underline',
                    color: 'var(--travel-primary-600)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  >
                    Chính sách quyền riêng tư
                  </a>
                </span>
              </TravelCheckbox>
            </div>
          </div>

          <TravelButton
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </TravelButton>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="space-y-3">
            <GoogleLoginButton
              onError={handleSocialError}
              buttonText="Tiếp tục bằng Google"
              loadingText="Đang tạo tài khoản..."
            />
            <FacebookLoginButton
              onError={handleSocialError}
              buttonText="Tiếp tục bằng Facebook"
              loadingText="Đang tạo tài khoản..."
            />
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Đã có tài khoản?{' '}
              <Link to={path.LANDING} className="text-[var(--travel-primary-600)] font-medium cursor-pointer transition-all duration-200 hover:underline decoration-2 decoration-[var(--travel-primary-600)] hover:underline-offset-4">
                Đăng nhập ngay
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

      {/* Right Side - Background Image */}
      <div className="relative h-full order-last w-full flex justify-center">
        <div className="relative z-10 rounded-3xl overflow-hidden w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <img
            src={background}
            alt="Social Network"
            className="w-full max-w-2xl h-auto rounded-3xl object-cover"
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

export default SignUpForm;
