export interface AdminBlog {
  blogId: string;
  title: string;
  thumbnailUrl?: string;
  authorName: string;
  authorId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING';
  viewCount: number;
  averageRating: number;
  totalRatings: number;
  category?: string;
  createdAt: string;
  publishedAt?: string;
}
