import authReducer from './authReducer';
import tabActiveReducer from "./tabReducer";
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

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    tab_active: persistReducer(tabConfig, tabActiveReducer)
});

export default rootReducer;
