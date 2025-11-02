import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

// Group Service - API calls for group operations
