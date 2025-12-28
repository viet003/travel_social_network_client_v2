import actionTypes from "../types/actionTypes";

const initState = {
    tab_active: actionTypes.HOME_ACTIVE
};

const tabActiveReducer = (state = initState, action: any) => {
    switch (action.type) {
        case actionTypes.HOME_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.HOME_ACTIVE
            };
        case actionTypes.EXPLORE_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.EXPLORE_ACTIVE
            };
        case actionTypes.MYTRIPS_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.MYTRIPS_ACTIVE
            };
        case actionTypes.GROUP_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.GROUP_ACTIVE
            };
        case actionTypes.MESSAGE_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.MESSAGE_ACTIVE
            };
        case actionTypes.PROFILE_ACTIVE:
            return {
                ...state,
                tab_active: actionTypes.PROFILE_ACTIVE
            };
        default:
            return state;
    }
}

export default tabActiveReducer