import authReducer from './authReducer';
import tabActiveReducer from "./tabReducer";
import conversationReducer from "./conversationReducer";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";

const authConfig = {
    key: 'auth',
    storage,
};

const tabConfig = {
    key: 'tab_active',
    storage,
    whitelist: ['active']
};

// Conversation reducer - KHÔNG persist vào localStorage
const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    tab_active: persistReducer(tabConfig, tabActiveReducer),
    conversation: conversationReducer  // Không persist
});

export default rootReducer;
