// User Types and Interfaces - Match with Backend API Response

export interface UserProfile {
    fullName: string | null;
    location: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    about: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface UserResponse {
    userId: string | null;
    userName: string;
    userProfile: UserProfile;
    avatarImg: string | null;
    coverImg: string | null;
    friendshipStatus: 'PENDING' | 'ACCEPTED' | 'BLOCKED' | null;
    postsCount: number;
    friendsCount: number;
}

export interface UpdateUserDto {
    userName: string;
    firstName: string;
    lastName: string;
    location: string;
    gender: string;
    dateOfBirth: string; // ISO date string format
    about?: string;
}

export interface UpdateUserResponse {
    userId: string | null;
    userName: string;
    userProfile: UserProfile;
    avatarImg: string | null;
    coverImg: string | null;
    message?: string;
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
    data: T;
    path?: string;
    message?: string;
    timestamp?: string;
    status?: number;
}

export interface UserMediaResponse {
    mediaId: string;
    url: string;
    createdAt: string;
    postId: string;
}

export interface UserPhotosResponse {
    avatars: UserMediaResponse[];
    coverImages: UserMediaResponse[];
    postPhotos: UserMediaResponse[];
}

export interface UserVideosResponse {
    videos: UserMediaResponse[];
}
