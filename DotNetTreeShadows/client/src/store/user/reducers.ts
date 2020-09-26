import { UserState, KnownUserAction, SET_USER_PROFILE, CLEAR_USER_PROFILE, FETCH_USER_PROFILE_SUCCESS } from './types';

const initialState : UserState = {
    id: '',
    loggedIn: false,
    profile: undefined
}

export function userReducer(state = initialState, action:KnownUserAction) : UserState {
    switch (action.type) {
        case FETCH_USER_PROFILE_SUCCESS:
            console.log("Setting profile")
            return {...state, profile: action.payload}
        case CLEAR_USER_PROFILE:
            return {...state, profile: undefined}
        default:
            return state;
    }


}
