import {
    Profile,
    SET_USER_PROFILE,
    CLEAR_USER_PROFILE,
    KnownUserAction,
    FETCH_USER_PROFILE_REQUEST,
    FETCH_USER_PROFILE_SUCCESS,
    FETCH_USER_PROFILE_FAILURE,
} from './types';
import { action, createAsyncAction } from 'typesafe-actions';

export const setUserProfile = (profile:Profile) => action(SET_USER_PROFILE, profile);
export const clearUserProfile = ()=> action(CLEAR_USER_PROFILE);

export const fetchUserProfile = createAsyncAction(FETCH_USER_PROFILE_REQUEST, FETCH_USER_PROFILE_SUCCESS, FETCH_USER_PROFILE_FAILURE)<undefined, Profile, string>();

