import actionTypes from "../types/actionTypes";
import { apiLoginService, apiSignupService, apiGoogleLoginService, apiFacebookLoginService } from "../../services/authService";

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    userName: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
}


interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    [key: string]: any;
}

export const login = (payload: LoginPayload) => async (dispatch: any): Promise<ApiResponse | undefined> => {
    try {
        const response = await apiLoginService(payload) as ApiResponse;

        if (response?.success) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response?.data
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response?.data
            });
        }

        console.log("Dispatched login action with response:", response?.data);
        return response;
    } catch (error: any) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        });
        return error;
    }
};

// export const login = (token: string, user: any) => ({
//     type: actionTypes.LOGIN_SUCCESS,
//     data: { 
//         token: token,
//         userId: user.id,
//         userProfile: {
//             firstName: user.name?.split(' ')[0] || user.name,
//             lastName: user.name?.split(' ').slice(1).join(' ') || ''
//         }
//     }
// });

export const logout = () => ({
    type: actionTypes.LOGOUT
});

export const checkAuthStatus = () => (dispatch: any, getState: any) => {
    const { token } = getState().auth;
    if (token) {
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            data: { token, msg: '' }
        });
    } else {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: { msg: 'No token found' }
        });
    }
};


export const updateAvatarImg = (imgUrl: string) => ({
    type: actionTypes.UPDATE_AVATARIMG,
    avatar: imgUrl,
});

export const register = (payload: RegisterPayload) => async (dispatch: any): Promise<ApiResponse | undefined> => {
    try {
        const response = await apiSignupService(payload) as ApiResponse;

        if (response?.success) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response?.data
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response?.data
            });
        }

        console.log("Dispatched register action with response:", response?.data);
        return response;
    } catch (error: any) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        });
        return error;
    }
};


export const updateCoverImg = (imgUrl: string) => ({
    type: actionTypes.UPDATE_COVERIMG,
    cover: imgUrl,
});

// Google Login Action
export const googleLogin = (credential: string) => async (dispatch: any): Promise<ApiResponse | undefined> => {
    try {
        const response = await apiGoogleLoginService(credential) as ApiResponse;

        if (response?.success) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response?.data
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response?.data
            });
        }

        console.log("Dispatched Google login action with response:", response?.data);
        return response;
    } catch (error: any) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        });
        return error;
    }
};

// Facebook Login Action
export const facebookLogin = (accessToken: string) => async (dispatch: any): Promise<ApiResponse | undefined> => {
    try {
        const response = await apiFacebookLoginService(accessToken) as ApiResponse;

        if (response?.success) {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                data: response?.data
            });
        } else {
            dispatch({
                type: actionTypes.LOGIN_FAIL,
                data: response?.data
            });
        }

        console.log("Dispatched Facebook login action with response:", response?.data);
        return response;
    } catch (error: any) {
        dispatch({
            type: actionTypes.LOGIN_FAIL,
            data: null
        });
        return error;
    }
};


