// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Thay thế bằng Google Client ID thực tế của bạn
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id-here',
  
  // Các cấu hình khác cho Google OAuth
  SCOPES: 'openid email profile',
  REDIRECT_URI: window.location.origin,
  
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

// Hướng dẫn cấu hình Google OAuth:
// 1. Truy cập https://console.developers.google.com/
// 2. Tạo project mới hoặc chọn project hiện có
// 3. Bật Google+ API và Google Identity API
// 4. Tạo OAuth 2.0 Client ID
// 5. Thêm domain của bạn vào Authorized JavaScript origins
// 6. Copy Client ID và thay thế 'your-google-client-id-here' ở trên
// 7. Tạo file .env.local với nội dung: VITE_GOOGLE_CLIENT_ID=your-actual-client-id
