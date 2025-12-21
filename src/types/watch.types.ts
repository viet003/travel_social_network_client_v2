// Watch (video) related type definitions

export interface CreateWatchDto {
  video: File;
  title: string;
  description?: string;
  thumbnail?: File;
  duration: number;
  location?: string;
  privacy: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
  category?: string;
  tags?: string[];
}

export interface UpdateWatchDto {
  watchId: string;
  title?: string;
  description?: string;
  thumbnail?: File;
  location?: string;
  privacy?: 'PUBLIC' | 'FRIEND' | 'PRIVATE';
  category?: string;
  tags?: string[];
}

export interface WatchResponse {
  watchId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number;
  location: string | null;
  privacy: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface WatchStatistics {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
}
