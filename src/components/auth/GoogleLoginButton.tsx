import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../../stores/actions';
import { path } from '../../utilities/path';
import { GOOGLE_CONFIG } from '../../configurations/googleConfig';

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
    setIsLoading(true);
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
                      // Convert access token to credential format
                      handleGoogleLogin(response.access_token);
                    }
                  }
                }).requestAccessToken();
              }
              // console.log("Notification:", notification, " ", GOOGLE_CONFIG.CLIENT_ID);
            });
          }
        }}
        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-sm font-medium">
          {isLoading ? loadingText : buttonText}
        </span>
      </button>
      
      {/* Hidden div cho Google button (để Google render vào) */}
      <div 
        ref={googleButtonRef}
        id="google-signin-button"
        className="hidden"
      />
      
      {isLoading && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">Đang xử lý đăng nhập Google...</span>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
