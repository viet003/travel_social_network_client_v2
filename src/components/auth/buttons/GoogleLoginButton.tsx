import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../../../stores/actions';
import { path } from '../../../utilities/path';
import { GOOGLE_CONFIG } from '../../../configurations/googleConfig';
import { LoadingSpinner } from '../../ui/loading';
import { Icon } from '@iconify/react';

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
  buttonText?: string;
  loadingText?: string;
}

const GoogleLoginButton = ({ onError, buttonText = 'Đăng nhập bằng Google', loadingText = 'Đang xử lý...' }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleLogin = async (credential: string) => {
    // Loading đã được hiển thị ở onClick, không cần gọi lại
    onError?.('');

    try {
      const response = await dispatch(authAction.googleLogin(credential) as any);
      
      if (response?.success) {
        navigate(path.HOME);
      } else {
        onError?.(response?.message || 'Đăng nhập Google thất bại');
      }
    } catch (error: any) {
      onError?.(error?.message || 'Có lỗi xảy ra khi đăng nhập Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    onError?.(`Lỗi Google: ${error}`);
    setIsLoading(false);
  };

  // Tải Google script và khởi tạo trong component
  useEffect(() => {
    const loadGoogleScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).google) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if ((window as any).google) {
            resolve();
          } else {
            reject(new Error('Google Identity Services failed to load'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load Google Identity Services script'));
        };
        
        document.head.appendChild(script);
      });
    };

    const initGoogleAuth = async () => {
      try {
        await loadGoogleScript();
        
        // Initialize Google OAuth (không render button vì dùng custom button)
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              console.log("Credential received:", response.credential);
              handleGoogleLogin(response.credential);
            } else {
              handleGoogleError('No credential received');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        onError?.('Không thể tải Google OAuth');
      }
    };

    initGoogleAuth();
  }, []);

  return (
    <div className="w-full max-w-md">
      {/* Custom Google Button với style giống SignUpForm */}
      <button 
        onClick={() => {
          // Hiển thị loading ngay khi click
          // showOAuthLoading();
          
          // Trigger Google OAuth One Tap
          if ((window as any).google) {
            (window as any).google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback to popup if One Tap is not available
                (window as any).google.accounts.oauth2.initTokenClient({
                  client_id: GOOGLE_CONFIG.CLIENT_ID,
                  scope: 'openid email profile',
                  callback: (response: any) => {
                    if (response.access_token) {
                      // console.log("Access token received:", response.access_token);
                      // Hiển thị loading khi bắt đầu gửi request đến server
                      setIsLoading(true);
                      // Convert access token to credential format
                      handleGoogleLogin(response.access_token);
                    } else {
                      // Không cần ẩn loading vì chưa hiển thị
                    }
                  }
                }).requestAccessToken();
              } else {
                // Nếu One Tap hiển thị thành công, chưa cần làm gì
                // Loading sẽ hiển thị khi user chọn account và gửi request
              }
              // console.log("Notification:", notification, " ", GOOGLE_CONFIG.CLIENT_ID);
            });
          } else {
            // Nếu Google SDK chưa load, hiển thị lỗi
            handleGoogleError('Google SDK chưa được tải');
          }
        }}
        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <Icon icon="logos:google-icon" className="w-5 h-5" />
               <span className="text-sm font-medium">
                 {isLoading ? (
                   <div className="flex items-center justify-center space-x-2">
                     <span>{loadingText}</span>
                     <LoadingSpinner size={14} color="#374151" />
                   </div>
                 ) : (
                   buttonText
                 )}
               </span>
      </button>
      
      {/* Hidden div cho Google button (để Google render vào) */}
      <div 
        ref={googleButtonRef}
        id="google-signin-button"
        className="hidden"
      />
      
    </div>
  );
};

export default GoogleLoginButton;
