// Comment-related type definitions

export interface CreateCommentPayload {
  postId?: string;
  watchId?: string;
  content: string;
  parentCommentId?: string;
}

export interface CommentResponse {
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  likeCount: number;
  replyCount: number;
  parentCommentId: string | null;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
