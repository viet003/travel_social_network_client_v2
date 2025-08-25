import actionTypes from "../types/actionTypes";

const initState = {
    userId: null,
    firstName: null,
    lastName: null,
    avatar: null,
    cover: null,
    isLoggedIn: false,
    token: null,
    msg: '',
};

const authReducer = (state = initState, action: any) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                userId: action?.data?.userId,
                firstName: action?.data?.userProfile?.firstName,
                lastName: action?.data?.userProfile?.lastName,
                avatar: action?.data?.avatarImg,
                cover: action?.data?.coverImg,
                isLoggedIn: true,
                token: action?.data?.token,
                msg: '',
            };
        case actionTypes.LOGIN_FAIL:
            return {
                ...state,
                userId: null,
                firstName: null,
                lastName: null,
                avatar: null,
                cover: null,
                isLoggedIn: false,
                token: null,
                msg: action?.data?.msg ? action?.data?.msg : '',
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                userId: null,
                firstName: null,
                lastName: null,
                avatar: null,
                cover: null,
                isLoggedIn: false,
                token: null,
                msg: '',
            };
        case actionTypes.CHECK_AUTH_STATUS:
            return {
                ...state,
                userId: null,
                firstName: null,
                lastName: null,
                avatar: null,
                cover: null,
                isLoggedIn: !!action?.data?.token,
                token: action?.data?.token || null,
                msg: action?.data?.msg || '',
            };
        case actionTypes.UPDATE_AVATARIMG:
            return {
                ...state,
                avatar: action.avatar,
            };
        case actionTypes.UPDATE_COVERIMG:
            return {
                ...state,
                cover: action.cover,
            };
        default:
            return state;
    }
};

export default authReducer;
