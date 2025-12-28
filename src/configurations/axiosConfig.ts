import axios from "axios";
import { store } from "./reduxConfig";
import { authAction } from "../stores/actions";
import { webSocketService } from "../services/webSocketService";

// Biến để track request đang refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - xử lý token
instance.interceptors.request.use(
  function (config) {
    const token = (store.getState() as { auth?: { token?: string | null } }).auth?.token;
    
    // Chỉ thêm Authorization header khi có token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi và auto refresh token
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const currentRefreshToken = (store.getState() as { auth?: { refreshToken?: string | null } }).auth?.refreshToken;
      
      // Nếu không có refresh token hoặc đang gọi endpoint refresh-token, logout
      if (!currentRefreshToken || originalRequest.url?.includes('/auth/refresh-token')) {
        const currentToken = (store.getState() as { auth?: { token?: string | null } }).auth?.token;
        if (currentToken) {
          store.dispatch(authAction.logout());
        }
        return Promise.reject(error);
      }
      
      // Nếu đang refresh token, đưa request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return instance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          { refreshToken: currentRefreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.data && response.data.data) {
          const { token: newToken, refreshToken: newRefreshToken, userId } = response.data.data;
          
          // Cập nhật token mới vào Redux store
          store.dispatch({
            type: 'LOGIN',
            data: {
              ...response.data.data,
              token: newToken,
              refreshToken: newRefreshToken
            }
          });

          // Update WebSocket connection with new token
          if (userId && webSocketService.isConnected()) {
            webSocketService.updateToken(newToken);
          }

          // Cập nhật Authorization header cho request gốc
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          
          // Process queue với token mới
          processQueue(null, newToken);
          
          // Retry request gốc
          return instance(originalRequest);
        } else {
          throw new Error('Invalid response from refresh token endpoint');
        }
      } catch (refreshError) {
        // Refresh token thất bại, logout user
        processQueue(refreshError, null);
        store.dispatch(authAction.logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Trả về error response để component có thể xử lý
    if (error.response) {
      return Promise.reject(error.response);
    }

    return Promise.reject(error);
  }
);

export default instance;