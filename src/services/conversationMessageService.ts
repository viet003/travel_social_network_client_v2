import axiosConfig from "../configurations/axiosConfig";

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

// Conversation Message Service - API calls for conversation message operations
