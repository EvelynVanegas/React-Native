import * as ActionTypes from './ActionTypes';

export const loggedIn = (state = false, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_USER:
            return true;
        case ActionTypes.LOGOUT_USER:
            return false;
        default:
            return state;
    }
};