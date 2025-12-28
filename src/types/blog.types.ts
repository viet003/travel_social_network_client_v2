// Blog Types
export interface Blog {
  blogId: string;
  author: UserSummary;
  title: string;
  content: string;
  description?: string;
  thumbnailUrl?: string;
  location?: string;
  viewCount: number;
  likeCount: number;
  reviewCount: number;
  averageRating: number;
  totalRatings: number;
  status: BlogStatus;
  isFeatured: boolean;
  readingTime?: number;
  tags?: Tag[];
  mediaUrls?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  hasReviewed?: boolean; // True if current user has already reviewed this blog
  contentModeration?: {
    moderationId: string;
    moderationReason: string;
    moderatedAt: string;
    moderatedByUserId: string;
  } | null;
}

export interface UserSummary {
  userId: string;
  userName: string;
  email: string;
  avatarImg?: string;
}

export interface Tag {
  tagId: string;
  title: string;
  description?: string;
}

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING';

export interface BlogDto {
  title: string;
  content: string;
  description?: string;
  thumbnailUrl?: string;
  location?: string;
  tagTitles?: string[];
  mediaUrls?: string[];
  status?: BlogStatus;
  isFeatured?: boolean;
  readingTime?: number;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data?: Blog;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  data?: {
    content: Blog[];
    totalElements: number;
    totalPages: number;
  };
}
