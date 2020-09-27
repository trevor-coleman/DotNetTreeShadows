import {
  Profile,
  SET_USER_PROFILE,
  CLEAR_USER_PROFILE,
  KnownUserAction,
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAILURE,
  GET_SESSIONS_INFO_REQUEST,
  GET_SESSIONS_INFO_SUCCESS,
  GET_SESSIONS_INFO_FAILURE, SessionInfo,
} from './types';
import { action, createAsyncAction } from 'typesafe-actions';

export const setUserProfile = (profile:Profile) => action(SET_USER_PROFILE, profile);
export const clearUserProfile = ()=> action(CLEAR_USER_PROFILE);

export const fetchUserProfile = createAsyncAction(FETCH_USER_PROFILE_REQUEST, FETCH_USER_PROFILE_SUCCESS, FETCH_USER_PROFILE_FAILURE)<undefined, Profile, string>();

export const getSessionsInfo = createAsyncAction(
    GET_SESSIONS_INFO_REQUEST,
    GET_SESSIONS_INFO_SUCCESS,
    GET_SESSIONS_INFO_FAILURE
) <undefined, SessionInfo[], string>();
