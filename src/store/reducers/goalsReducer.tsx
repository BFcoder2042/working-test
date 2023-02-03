import { GET_MY_GOALS, GET_DIRECTORY_GOALS, GET_PERIODS, GET_SECTIONS, GET_FILTERING_DIRECTORY_GOALS, GET_TAGS, GET_USERS_GOALS, GET_USERS_GOALS_STATUSES, SET_CURRENT_PERIOD, CLEAR_MY_GOALS } from "../actions/types";

const initValue : any = {
    myGoals: [],
    directoryGoals: [],
    periods: [],
    sections: [],
    filteringDirectoryGoals: [],
    tags: [],
    usersGoals: [],
    statuses: [],
    currentPeriod: null
}

export const goalsReducer = (state = initValue, action) => {
    switch (action.type) {
        case GET_MY_GOALS:
            return { ...state, myGoals: action.payload };
        case GET_DIRECTORY_GOALS:
            return { ...state, directoryGoals: action.payload };
        case GET_PERIODS:
            return { ...state, periods: action.payload };
        case GET_SECTIONS:
            return { ...state, sections: action.payload };
        case GET_FILTERING_DIRECTORY_GOALS:
            return { ...state, filteringDirectoryGoals: action.payload };
        case GET_TAGS:
            return { ...state, tags: action.payload };
        case GET_USERS_GOALS:
            return { ...state, usersGoals: action.payload };
        case GET_USERS_GOALS_STATUSES:
            return { ...state, statuses: action.payload };
        case SET_CURRENT_PERIOD:
            return { ...state, currentPeriod: action.payload };
        case CLEAR_MY_GOALS:
            return { ...state, myGoals: action.payload };
        default:
            return state;
    }
}