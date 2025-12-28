import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../../../stores/actions';
import { path } from '../../../utilities/path';
import { FACEBOOK_CONFIG } from '../../../configurations/facebookConfig';
import { LoadingSpinner } from '../../ui/loading';
import { Icon } from '@iconify/react';

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
    // Loading đã được hiển thị ở onClick, không cần gọi lại
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
    // Hiển thị loading ngay khi click
    // showOAuthLoading();
    
    if (!(window as any).FB) {
      handleFacebookError('Facebook SDK chưa được tải');
      return;
    }

    // Sử dụng Facebook Login API để lấy access token
    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        // Lấy access token từ response
        const accessToken = response.authResponse.accessToken;
        // Hiển thị loading khi bắt đầu gửi request đến server
        setIsLoading(true);
        handleFacebookLogin(accessToken);
      } else {
        // Không cần ẩn loading vì chưa hiển thị
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
        <Icon icon="logos:facebook" className="w-5 h-5" />
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
      
      
    </div>
  );
};

export default FacebookLoginButton;
