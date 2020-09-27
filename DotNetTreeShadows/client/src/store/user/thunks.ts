import { fetchUserProfile, getSessionsInfo } from './actions';
import axios, { AxiosResponse } from 'axios';
import { Profile, SessionInfo } from './types';
import { getFriendsAsync } from '../friends/thunks';
import { AppThunk } from '../middleware/thunks';
import { getAllInvitationsAsync, getSentInvitationsAsync, getReceivedInvitationsAsync } from '../invitations/thunks';

export const fetchUserProfileAsync = () : AppThunk => async (dispatch, getState) => {
  dispatch(fetchUserProfile.request());
  try {
    const asyncResp: AxiosResponse = await axios.get('profiles/me', {baseURL: "https://localhost:5001/api/", headers: { Authorization: `Bearer ${getState().system.token}` } });
    const profile = await asyncResp.data as Profile;
    console.log(profile);
    dispatch(fetchUserProfile.success(profile))
    dispatch(getFriendsAsync())
    dispatch(getSentInvitationsAsync())
    dispatch(getReceivedInvitationsAsync())
  } catch (e) {
    dispatch(fetchUserProfile.failure(e.statusMessage ?? e.message));
  }
}

export const getSessionsInfoAsync = (): AppThunk => async (dispatch, getState) => {
    dispatch(getSessionsInfo.request());
    try {
        const asyncResp: AxiosResponse = await axios.get('profiles/me/sessions',
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        const sessionsInfo = await asyncResp.data as SessionInfo[];
        dispatch(getSessionsInfo.success(sessionsInfo));
    } catch (e) {
        dispatch(getSessionsInfo.failure(e?.response?.data?.message ?? e.statusMessage));
    }
};
