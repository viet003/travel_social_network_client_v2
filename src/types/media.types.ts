// Media-related type definitions

export interface MediaUploadResponse {
  mediaId: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  size: number;
  uploadedAt: string;
}

export interface PostMediaResponse {
  mediaId: number;
  postId: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}
