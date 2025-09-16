import axios from "axios";
import { store } from "./reduxConfig";
import { authAction } from "../stores/actions";

// Sử dụng store singleton

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

// Response interceptor - xử lý lỗi
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Chỉ logout nếu đang có token (tránh logout liên tục)
      const currentToken = (store.getState() as { auth?: { token?: string | null } }).auth?.token;
      if (currentToken) {
        store.dispatch(authAction.logout());
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