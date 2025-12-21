// Like-related type definitions

export interface ContentLikeResponse {
  contentId: string; // Can be postId or watchId
  likeCount: number;
  liked: boolean;
}

export interface LikeToggleResponse {
  liked: boolean;
  likeCount: number;
}
