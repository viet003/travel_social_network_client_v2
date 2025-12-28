export interface UserSummary {
    userId: string;
    userName: string;
    email: string;
    avatarImg: string | null;
}

export interface ConversationResponse {
    conversationId: string;
    conversationName: string | null;
    conversationAvatar: string | null;
    type: "PRIVATE" | "GROUP";
    otherUserId: string | null;
    lastMessage: string | null;
    lastActiveAt: string | null;
    groupOwner?: boolean | null;
    members?: UserSummary[];
    recentMedia?: string[];
}
