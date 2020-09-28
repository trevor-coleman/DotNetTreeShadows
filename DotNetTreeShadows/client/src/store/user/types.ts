import { clearUserProfile } from './actions';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const CLEAR_USER_PROFILE='CLEAR_USER_PROFILE';

export const FETCH_USER_PROFILE_REQUEST ='FETCH_USER_PROFILE_REQUEST';
export const FETCH_USER_PROFILE_SUCCESS ='FETCH_USER_PROFILE_SUCCESS';
export const FETCH_USER_PROFILE_FAILURE ='FETCH_USER_PROFILE_FAILURE';

export type KnownUserAction = SetProfileAction | ClearProfileAction | FetchUserProfileSuccess | GetSessionsInfoAction

export interface SessionInfo {
  name:string;
  id: string;
}

export interface Profile {
  name: string;
  friends: string[];
  sessions: SessionInfo[];
  sentInvitations: string[];
  receivedInvitations:string[];
  [key:string]: any;
}



export interface UserState {
  loggedIn: boolean;
  id: string;
  profile: Profile | undefined;
}

interface SetProfileAction {
    type: typeof SET_USER_PROFILE;
    payload: Profile
}

interface ClearProfileAction {
    type: typeof CLEAR_USER_PROFILE;
}

interface FetchUserProfileRequest {
    type: typeof FETCH_USER_PROFILE_REQUEST;
    payload: Profile;
}
interface FetchUserProfileSuccess {
    type: typeof FETCH_USER_PROFILE_SUCCESS;
    payload: Profile;
}
interface FetchUserProfileFailure {
    type: typeof FETCH_USER_PROFILE_FAILURE;
    payload: Profile;
}

export const GET_SESSIONS_INFO_REQUEST ='GET_SESSIONS_INFO_REQUEST';
export const GET_SESSIONS_INFO_SUCCESS ='GET_SESSIONS_INFO_SUCCESS';
export const GET_SESSIONS_INFO_FAILURE ='GET_SESSIONS_INFO_FAILURE';

export interface GetSessionsInfoRequest {
    type: typeof GET_SESSIONS_INFO_REQUEST

}

export interface GetSessionsInfoSuccess {
    type: typeof GET_SESSIONS_INFO_SUCCESS
    payload: SessionInfo[]
}

export interface GetSessionsInfoFailure {
    type: typeof GET_SESSIONS_INFO_FAILURE
    payload: string
}

type GetSessionsInfoAction = GetSessionsInfoRequest | GetSessionsInfoSuccess | GetSessionsInfoFailure;




