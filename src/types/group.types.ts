// Group-related type definitions

export interface FriendMember {
  userId: string;
  name: string;
  avatar: string | null;
}

export interface GroupMemberResponse {
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string | null;
  role: string; // OWNER, ADMIN, MODERATOR, MEMBER
  status: string; // PENDING, APPROVED
  isFriend: boolean;
  postsCount: number;
  joinedAt: string; // ISO date string
}

export interface GroupResponse {
  groupId: string;
  groupName: string;
  groupDescription: string | null;
  coverImageUrl: string | null;
  memberCount: number;
  privacy: boolean; // true = private, false = public
  isMember: boolean;
  currentUserRole: string | null; // OWNER, ADMIN, MODERATOR, MEMBER, null if not a member
  createdAt: string | null; // ISO date string
  lastActivityAt: string | null; // ISO date string
  postsPerDay: number; // Average posts per day in last 30 days
  postsToday: number; // Posts today
  postsLastMonth: number; // Posts last month
  newMembersThisWeek: number; // New members this week
  tags: string | null; // Group tags
  location: string | null; // Group location
  friendMembers: FriendMember[]; // Friends who are members of this group
  adminMembers: FriendMember[]; // Admin members
  moderatorMembers: FriendMember[]; // Moderator members
  contentModeration?: {
    moderationId: string;
    moderationReason: string;
    moderatedAt: string;
    moderatedByUserId: string;
  } | null;
}

export interface CreateGroupDto {
  groupName: string;
  groupDescription?: string;
  privacy: 'PUBLIC' | 'PRIVATE';
  coverImage?: File;
  tags?: string;
  location?: string;
}

export interface UpdateGroupDto {
  groupName?: string;
  groupDescription?: string;
  privacy?: 'PUBLIC' | 'PRIVATE';
  coverImage?: File;
  tags?: string;
  location?: string;
}
