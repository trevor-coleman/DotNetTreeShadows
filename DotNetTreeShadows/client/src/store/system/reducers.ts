import {
    SystemState,
    KnownSystemAction,
    UPDATE_SESSION,
    SignInResponse,
    SIGN_IN_USER_FAILURE,
    SIGN_IN_USER_REQUEST,
    SIGN_IN_USER_SUCCESS,
    REGISTER_NEW_USER_REQUEST,
    REGISTER_NEW_USER_SUCCESS, REGISTER_NEW_USER_FAILURE,
} from './types';

const initialState:SystemState = {
    id: '',
    loggedIn: false,
    token: '',
    tokenExpiration: null,
    authInProgress: false,
}

export function systemReducer(state=initialState, action:KnownSystemAction):SystemState {
    switch (action.type) {
        case REGISTER_NEW_USER_FAILURE:
            return {...state, authInProgress: false}
        case REGISTER_NEW_USER_REQUEST:
            return {...state, authInProgress: true}
        case REGISTER_NEW_USER_SUCCESS:
            return {...state, authInProgress: false}
        case SIGN_IN_USER_SUCCESS:
            const payload = action.payload as SignInResponse;
            return {...state, token: payload.token, tokenExpiration: payload.expiration, authInProgress:false, loggedIn: true};
        case SIGN_IN_USER_REQUEST:
            return {...state, authInProgress: true}
        case SIGN_IN_USER_FAILURE:
            return {...state, authInProgress: false}
        case UPDATE_SESSION:
            return {...state,...action.payload};
        default:
            return state;
    }
}
