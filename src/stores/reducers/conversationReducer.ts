import actionTypes from "../types/actionTypes";
import type { ConversationResponse } from "../../services/conversationService";

export interface ConversationState {
    conversations: ConversationResponse[];
    activeConversationId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: ConversationState = {
    conversations: [],
    activeConversationId: null,
    loading: false,
    error: null
};

interface Action {
    type: string;
    payload?: any;
}

const conversationReducer = (state = initialState, action: Action): ConversationState => {
    switch (action.type) {
        case actionTypes.SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
                error: null
            };

        case actionTypes.ADD_CONVERSATION:
            // Check if conversation already exists
            const existingIndex = state.conversations.findIndex(
                conv => conv.conversationId === action.payload.conversationId
            );

            if (existingIndex !== -1) {
                // Update existing conversation
                const updatedConversations = [...state.conversations];
                updatedConversations[existingIndex] = action.payload;
                return {
                    ...state,
                    conversations: updatedConversations
                };
            } else {
                // Add new conversation
                return {
                    ...state,
                    conversations: [action.payload, ...state.conversations]
                };
            }

        case actionTypes.UPDATE_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.map(conv =>
                    conv.conversationId === action.payload.conversationId
                        ? action.payload
                        : conv
                )
            };

        case actionTypes.SET_ACTIVE_CONVERSATION:
            return {
                ...state,
                activeConversationId: action.payload
            };

        case actionTypes.SET_CONVERSATIONS_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case actionTypes.SET_CONVERSATIONS_ERROR:
            return {
                ...state,
                error: action.payload
            };

        // Clear conversations on logout
        case actionTypes.LOGOUT:
            return initialState;

        default:
            return state;
    }
};

export default conversationReducer;
