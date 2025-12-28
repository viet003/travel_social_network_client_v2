// Friendship Types and Interfaces

export interface FriendshipResponse {
    friendshipId: string;
    requesterId?: string;
    receiverId?: string;
    friendProfile: UserResponse;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED' | null;
    createdAt: string | null;
}

export interface UserFriendshipListsResponse {
    pendingRequests: FriendshipResponse[];  // Lời mời kết bạn nhận được
    friends: UserResponse[];                // Danh sách bạn bè
    blockedUsers: UserResponse[];           // Danh sách người đã chặn
}

export interface FriendShipRequestDto {
    receiverId: string;
}

export interface UserResponse {
    userId: string | null;
    userName: string;
    userProfile: {
        fullName: string | null;
        location: string | null;
        gender: string | null;
        dateOfBirth: string | null;
        about: string | null;
    };
    avatarImg: string | null;
    coverImg: string | null;
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
