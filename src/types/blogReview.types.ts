export interface BlogReviewResponse {
  reviewId: string;
  blogId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogReviewPayload {
  blogId: string;
  content: string;
  rating?: number;
}
