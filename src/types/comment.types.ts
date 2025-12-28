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
  fullName: string;
  avatarImg: string | null;
  content: string;
  likeCount: number;
  replyCount: number;
  parentCommentId: string | null;
  liked: boolean;
  createdAt: string;
}
