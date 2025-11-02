import axiosConfig from '../configurations/axiosConfig';

export interface UserPhotoResponse {
    photoId: string;
    url: string;
    createdAt: string | null;
    postId: string | null;
}

export interface UserPhotosWrapper {
    avatars: UserPhotoResponse[];
    coverImages: UserPhotoResponse[];
    postPhotos: UserPhotoResponse[];
}

// Server response structure
interface ServerResponse<T> {
    success: boolean;
    path: string;
    message: string;
    data: T;
    errors: null | string[];
    timestamp: string;
}

export const apiGetUserPhotos = (userId: string): Promise<{ data: ServerResponse<UserPhotosWrapper> }> => {
    return axiosConfig.get(`/users/${userId}/photos`);
};
