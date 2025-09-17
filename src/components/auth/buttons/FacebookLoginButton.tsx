import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../../../stores/actions';
import { path } from '../../../utilities/path';
import { FACEBOOK_CONFIG } from '../../../configurations/facebookConfig';

interface FacebookLoginButtonProps {
  onError?: (error: string) => void;
  buttonText?: string;
  loadingText?: string;
}

const FacebookLoginButton = ({ 
  onError,
  buttonText = 'Đăng nhập bằng Facebook', 
  loadingText = 'Đang xử lý...' 
}: FacebookLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFacebookLogin = async (accessToken: string) => {
    setIsLoading(true);
    onError?.('');

    try {
      const response = await dispatch(authAction.facebookLogin(accessToken) as any);
      
      if (response?.success) {
        navigate(path.HOME);
      } else {
        onError?.(response?.message || 'Đăng nhập Facebook thất bại');
      }
    } catch (error: any) {
      onError?.(error?.message || 'Có lỗi xảy ra khi đăng nhập Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookError = (error: string) => {
    onError?.(`Lỗi Facebook: ${error}`);
    setIsLoading(false);
  };

  // Load Facebook SDK và khởi tạo
  useEffect(() => {
    const loadFacebookScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).FB) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if ((window as any).FB) {
            resolve();
          } else {
            reject(new Error('Facebook SDK failed to load'));
          }
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load Facebook SDK script'));
        };
        
        document.head.appendChild(script);
      });
    };

    const initFacebookAuth = async () => {
      try {
        await loadFacebookScript();
        
        // Initialize Facebook SDK
        (window as any).FB.init({
          appId: FACEBOOK_CONFIG.APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      } catch (error) {
        console.error('Failed to initialize Facebook Auth:', error);
        onError?.('Không thể tải Facebook SDK');
      }
    };

    initFacebookAuth();
  }, []);

  const handleFacebookClick = () => {
    setIsLoading(true);
    
    if (!(window as any).FB) {
      handleFacebookError('Facebook SDK chưa được tải');
      return;
    }

    // Sử dụng Facebook Login API để lấy access token
    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        // Lấy access token từ response
        const accessToken = response.authResponse.accessToken;
        handleFacebookLogin(accessToken);
      } else {
        handleFacebookError('Đăng nhập Facebook thất bại hoặc bị hủy');
      }
    }, { 
      scope: FACEBOOK_CONFIG.SCOPES,
      return_scopes: true 
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Custom Facebook Button với style giống Google */}
      <button 
        onClick={handleFacebookClick}
        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="text-sm font-medium">
          {isLoading ? loadingText : buttonText}
        </span>
      </button>
      
      
      {isLoading && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">Đang xử lý đăng nhập Facebook...</span>
        </div>
      )}
    </div>
  );
};

export default FacebookLoginButton;
