import { GET_CURRENT_USER, GET_CURATORS, GET_GROUPS_CURRENT_USER, GET_PARTISIPIANTS, SET_CURRENT_USER_GROUP } from "../actions/types";

const initValue : any = {
    currentUser: null,
    curators: [],
    partisipiant: [],
    currentUserIsAdmin: null,
    currentUserGroup: null
}

export const usersReducer = (state = initValue, action) => {
    switch (action.type) {
        case GET_CURRENT_USER:
            return { ...state, currentUser: action.payload };
        case GET_CURATORS:
            return { ...state, curators: action.payload };
        case GET_GROUPS_CURRENT_USER:
            return { ...state, currentUserIsAdmin: action.payload };
        case GET_PARTISIPIANTS:
            return { ...state, partisipiant: action.payload };
        case SET_CURRENT_USER_GROUP:
            return { ...state, currentUserGroup: action.payload };
        default:
            return state;
    }
}