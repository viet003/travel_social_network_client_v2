// Trip Types - matching server entities

export interface ConversationInfo {
  conversationId: string;
  conversationName: string | null;
  conversationAvatar: string | null;
}

export interface TripResponse {
  tripId: string;
  conversation: ConversationInfo;
  tripName: string;
  tripDescription: string | null;
  coverImageUrl: string | null;
  destination: string | null;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  budget: number | null;
  status: TripStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  scheduleCount: number;
}

export interface TripScheduleResponse {
  tripScheduleId: string;
  tripId: string;
  title: string;
  description: string | null;
  location: string | null;
  scheduleDate: string; // ISO 8601 format
  startTime: string | null; // ISO 8601 format
  endTime: string | null; // ISO 8601 format
  activityType: ActivityType | null;
  estimatedCost: number | null;
  notes: string | null;
  orderIndex: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export type TripStatus = 'PLANNING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type ActivityType = 'VISIT' | 'MEAL' | 'ACCOMMODATION' | 'TRANSPORT' | 'OTHER';

export interface TripDto {
  conversationId: string;
  tripName: string;
  tripDescription?: string;
  coverImageUrl?: string;
  destination?: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  budget?: number;
  status?: TripStatus;
}

export interface TripScheduleDto {
  tripId: string;
  title: string;
  description?: string;
  location?: string;
  scheduleDate: string; // ISO 8601 format
  startTime?: string; // ISO 8601 format
  endTime?: string; // ISO 8601 format
  activityType?: ActivityType;
  estimatedCost?: number;
  notes?: string;
  orderIndex?: number;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  path: string;
  message: string;
  data: T;
  errors: any;
  timestamp: string;
}
