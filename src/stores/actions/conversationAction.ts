import actionTypes from "../types/actionTypes";
import {
    apiGetUserConversations,
    apiCreateOrGetPrivateConversation,
} from "../../services/conversationService";
import type { ConversationResponse } from "../../types/conversation.types";
import type { Dispatch } from "redux";

// Action to set conversations list
export const setConversations = (conversations: ConversationResponse[]) => ({
    type: actionTypes.SET_CONVERSATIONS,
    payload: conversations
});

// Action to add a new conversation
export const addConversation = (conversation: ConversationResponse) => ({
    type: actionTypes.ADD_CONVERSATION,
    payload: conversation
});

// Action to update an existing conversation
export const updateConversation = (conversation: ConversationResponse) => ({
    type: actionTypes.UPDATE_CONVERSATION,
    payload: conversation
});

// Action to set active conversation
export const setActiveConversation = (conversationId: string | null) => ({
    type: actionTypes.SET_ACTIVE_CONVERSATION,
    payload: conversationId
});

// Action to set loading state
export const setConversationsLoading = (loading: boolean) => ({
    type: actionTypes.SET_CONVERSATIONS_LOADING,
    payload: loading
});

// Action to set error state
export const setConversationsError = (error: string | null) => ({
    type: actionTypes.SET_CONVERSATIONS_ERROR,
    payload: error
});

// Thunk action to fetch user conversations
export const fetchUserConversations = (page: number = 0, size: number = 20) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setConversationsLoading(true));
            dispatch(setConversationsError(null));

            const response = await apiGetUserConversations(page, size);

            if (response.data && response.data.content) {
                dispatch(setConversations(response.data.content));
            }
        } catch (error: any) {
            console.error("Error fetching conversations:", error);
            dispatch(setConversationsError(error.message || "Failed to fetch conversations"));
        } finally {
            dispatch(setConversationsLoading(false));
        }
    };
};

// Thunk action to create or get private conversation
export const createOrGetPrivateConversation = (friendUserId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setConversationsLoading(true));
            dispatch(setConversationsError(null));

            const response = await apiCreateOrGetPrivateConversation(friendUserId);

            if (response.data) {
                // Add or update conversation in the list
                dispatch(addConversation(response.data));
                // Set as active conversation
                dispatch(setActiveConversation(response.data.conversationId));

                return response.data;
            }
        } catch (error: any) {
            console.error("Error creating/getting private conversation:", error);
            dispatch(setConversationsError(error.message || "Failed to create conversation"));
            throw error;
        } finally {
            dispatch(setConversationsLoading(false));
        }
    };
};
