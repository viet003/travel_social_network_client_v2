import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

// Conversation Service - API calls for conversation operations
