export interface DashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalPosts: number;
  totalReports: number;
  userGrowthRate: number;
  tripGrowthRate: number;
  postGrowthRate: number;
  reportGrowthRate: number;
}

export interface TrafficData {
  name: string;
  visits: number;
}

export interface RecentUser {
  userId: string;
  userName: string;
  email: string;
  avatarImg?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
}

export interface RecentActivity {
  title: string;
  description: string;
  timestamp: string;
  activityType: 'USER_REGISTERED' | 'POST_CREATED' | 'REPORT_SUBMITTED' | 'GROUP_CREATED';
}

export interface AdminDashboardData {
  stats: DashboardStats;
  trafficData: TrafficData[];
  recentUsers: RecentUser[];
  recentActivities: RecentActivity[];
}
