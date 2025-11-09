// Video/Reels Types and Interfaces

export interface VideoUserResponse {
    userId: string;
    fullName: string;
    avatarImg: string | null;
}

export interface VideoResponse {
    videoId: string;
    title: string;
    description: string | null;
    videoUrl: string;
    duration: number; // in seconds
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    location: string | null;
    createdAt: string;
    updatedAt: string | null;
    user: VideoUserResponse;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    viewCount: number;
    tags: string[];
    liked: boolean;
    watched: boolean;
}

export interface CreateVideoDto {
    title: string;
    description?: string;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    location?: string;
    tags?: string[];
    videoFile: File;
}

export interface UpdateVideoDto {
    title?: string;
    description?: string;
    privacy?: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    location?: string;
    tags?: string[];
}

export interface PageableResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    path: string;
    message: string;
    data: T;
    errors: unknown;
    timestamp: string;
}

export interface VideoFeedResponse {
    videos: VideoResponse[];
    hasMore: boolean;
    nextPage: number | null;
}

export interface VideoWatchHistoryResponse {
    videoId: string;
    watchedAt: string;
    watchDuration: number; // seconds watched
    completed: boolean;
}

export interface VideoStatisticsResponse {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
}
