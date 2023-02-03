import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { goalsReducer } from './reducers/goalsReducer';
import { usersReducer } from './reducers/usersReducer';

const rootReducer = combineReducers({
    goals: goalsReducer,
    users: usersReducer,
});

export const store : any = createStore(rootReducer, {}, applyMiddleware(thunk));