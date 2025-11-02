// Post Types and Interfaces

export interface PostMedia {
    mediaId: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export interface PostResponse {
    postId: string;
    content: string;
    location: string | null;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    createdAt: string;
    userId: string;
    avatarImg: string | null;
    coverImg: string | null;
    fullName: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    mediaList: PostMedia[];
    tags: string[];
    isShare: boolean;
    group: {
        groupId: string;
        groupName: string;
        coverImageUrl: string | null;
    } | null;
    isLiked: boolean;
}

export interface UpdatePostDto {
    content: string;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    location?: string;
    tags?: string[];
    mediaFiles?: File[];
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
