export interface AdminGroup {
  groupId: string;
  groupName: string;
  coverImageUrl?: string;
  memberCount: number;
  createdBy: string;
  status: 'ACTIVE' | 'WARNING' | 'BANNED';
  postsPerDay: number;
  tags?: string;
  createdAt: string;
  isLocked?: boolean;
  moderationReason?: string;
}
