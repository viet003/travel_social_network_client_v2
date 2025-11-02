import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

// Conversation Member Service - API calls for conversation member operations
