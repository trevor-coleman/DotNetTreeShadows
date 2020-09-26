import {
    SystemState,
    UPDATE_SESSION,
    KnownSystemAction,
    SIGN_IN_USER_SUCCESS,
    SIGN_IN_USER_FAILURE,
    SIGN_IN_USER_REQUEST,
    SignInCredentials,
    SignInResponse,
    REGISTER_NEW_USER_REQUEST,
    REGISTER_NEW_USER_SUCCESS,
    REGISTER_NEW_USER_FAILURE, NewUserInfo,
} from './types';
import { createAsyncAction } from 'typesafe-actions';
import { Profile } from '../user/types';

export function updateSession(newSession: SystemState): KnownSystemAction {
    return {
        type: UPDATE_SESSION,
        payload: newSession,
    };
}


export const signInUser = createAsyncAction(SIGN_IN_USER_REQUEST,
    SIGN_IN_USER_SUCCESS,
    SIGN_IN_USER_FAILURE)<SignInCredentials, SignInResponse, Error>();

export const registerNewUser = createAsyncAction(REGISTER_NEW_USER_REQUEST,
    REGISTER_NEW_USER_SUCCESS,
    REGISTER_NEW_USER_FAILURE)<NewUserInfo, NewUserInfo, Error>();
