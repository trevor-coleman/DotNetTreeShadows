import { clearUserProfile } from './actions';

export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const CLEAR_USER_PROFILE='CLEAR_USER_PROFILE';
export const FETCH_USER_PROFILE_REQUEST ='FETCH_USER_PROFILE_REQUEST';
export const FETCH_USER_PROFILE_SUCCESS ='FETCH_USER_PROFILE_SUCCESS';
export const FETCH_USER_PROFILE_FAILURE ='FETCH_USER_PROFILE_FAILURE';



export interface Profile {
  name: string;
  id: string;
  friends: string[];
  sessions: string[];
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

interface FetchUserProfileSuccess {
    type: typeof FETCH_USER_PROFILE_SUCCESS;
    payload: Profile;
}


export type KnownUserAction = SetProfileAction | ClearProfileAction | FetchUserProfileSuccess

