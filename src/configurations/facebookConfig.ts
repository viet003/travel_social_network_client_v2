// Facebook OAuth Configuration
export const FACEBOOK_CONFIG = {
  // Thay thế bằng Facebook App ID thực tế của bạn
  APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id-here',
  
  // Các cấu hình khác cho Facebook OAuth
  VERSION: 'v18.0',
  COOKIE: true,
  XFBML: true,
  
  // Các quyền (scopes) cần thiết - chỉ cần public_profile (email đã được bao gồm)
  SCOPES: 'public_profile,email',
  
  // Cấu hình button
  BUTTON_CONFIG: {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: '100%'
  }
};
