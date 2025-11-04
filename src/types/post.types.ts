// Post Types and Interfaces

export interface PostMedia {
    mediaId: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
}

export interface PostUserResponse {
    userId: string;
    fullName: string;
    avatarImg: string | null;
}

export interface PostResponse {
    postId: string;
    content: string;
    location: string | null;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    postType?: 'NORMAL' | 'AVATAR_UPDATE' | 'COVER_UPDATE';
    createdAt: string;
    user: PostUserResponse | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    mediaList: PostMedia[];
    tags: string[];
    isShare: boolean;
    sharedPost: PostResponse | null;
    group: {
        groupId: string;
        groupName: string;
        coverImageUrl: string | null;
    } | null;
    liked: boolean;
}

export interface UpdatePostDto {
    content: string;
    privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    postType?: 'NORMAL' | 'AVATAR_UPDATE' | 'COVER_UPDATE';
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
