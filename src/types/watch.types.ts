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
  user: {
    userId: string;
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
    friendshipStatus: string | null;
    postsCount: number;
    friendsCount: number;
  };
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number;
  location: string | null;
  privacy: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  liked: boolean;
  saved: boolean;
  watched: boolean;
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
