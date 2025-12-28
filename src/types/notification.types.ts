// Notification Types - Based on backend structure

export interface UserSummaryResponse {
  userId: string;
  userName: string;
  email: string;
  avatarImg: string | null;
}

export interface NotificationResponse {
  notificationId: string;
  receiverId: string;
  receiverName: string;
  sender: UserSummaryResponse | null;
  type: NotificationTypeEnum;
  content: string;
  relatedId: string | null;
  read: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const NotificationTypeEnum = {
  NEW_POST: "NEW_POST",
  POST_LIKE: "POST_LIKE",
  POST_COMMENT: "POST_COMMENT",
  POST_SHARE: "POST_SHARE",
  FRIEND_REQUEST: "FRIEND_REQUEST",
  FRIEND_ACCEPTED: "FRIEND_ACCEPTED",
  GROUP_INVITE: "GROUP_INVITE",
  GROUP_JOIN_REQUEST: "GROUP_JOIN_REQUEST",
  GROUP_JOIN_ACCEPTED: "GROUP_JOIN_ACCEPTED",
  CHAT_MESSAGE: "CHAT_MESSAGE",
  MENTION: "MENTION",
  SYSTEM: "SYSTEM"
} as const;

export type NotificationTypeEnum = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];

export interface CreateNotificationDto {
  receiverId: string;
  senderId?: string;
  type: string;
  content: string;
  relatedId?: string;
}

export interface UpdateNotificationDto {
  content?: string;
  read: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  path?: string;
  [key: string]: any;
}

// WebSocket notification payload
export interface WebSocketNotificationPayload {
  type: string;
  content: string;
  relatedId: string;
  timestamp: number;
  read: boolean;
  senderId?: string;
  senderName?: string;
}
