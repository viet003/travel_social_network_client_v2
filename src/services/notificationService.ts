import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

// Notification Service - API calls for notification operations
