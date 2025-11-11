// Video/Watch Types and Interfaces (synced with Watch.java entity)

export interface WatchUserResponse {
    userId: string;
    userName?: string;
    fullName?: string;
    avatarImg?: string;
}

export interface WatchResponse {
    watchId: string;
    user: WatchUserResponse;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration: number; // Duration in seconds
    location?: string;
    privacy: 'PUBLIC' | 'FRIEND' | 'PRIVATE'; // PrivacyTypeEnum from server
    likeCount: number;
    commentCount: number;
    shareCount: number;
    viewCount: number;
    createdAt: string;
    updatedAt?: string;
    tags: string[];
    liked?: boolean; // Client-side: if current user liked
    saved?: boolean; // Client-side: if current user saved
    watched?: boolean; // Client-side: if current user watched
}

export interface WatchWithIdsResponse extends WatchResponse {
    watchHistoryId?: string;
}

export interface CreateWatchDto {
    title: string;
    description?: string;
    privacy: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
    location?: string;
    tags?: string[];
    videoFile: File;
    thumbnailFile?: File;
}

export interface UpdateWatchDto {
    title?: string;
    description?: string;
    privacy?: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
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

export interface WatchFeedResponse {
    watches: WatchResponse[];
    hasMore: boolean;
    nextPage: number | null;
}

export interface WatchHistoryResponse {
    watchId: string;
    watchedAt: string;
    watchDuration: number; // seconds watched
    completed: boolean;
}

export interface WatchStatisticsResponse {
    totalWatches: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
}

// Legacy Video types (deprecated - use Watch types instead)
/**
 * @deprecated Use WatchUserResponse instead
 */
export type VideoUserResponse = WatchUserResponse;

/**
 * @deprecated Use WatchResponse instead
 */
export type VideoResponse = WatchResponse;

/**
 * @deprecated Use CreateWatchDto instead
 */
export type CreateVideoDto = CreateWatchDto;

/**
 * @deprecated Use UpdateWatchDto instead
 */
export type UpdateVideoDto = UpdateWatchDto;

/**
 * @deprecated Use WatchFeedResponse instead
 */
export type VideoFeedResponse = WatchFeedResponse;

/**
 * @deprecated Use WatchHistoryResponse instead
 */
export type VideoWatchHistoryResponse = WatchHistoryResponse;

/**
 * @deprecated Use WatchStatisticsResponse instead
 */
export type VideoStatisticsResponse = WatchStatisticsResponse;

