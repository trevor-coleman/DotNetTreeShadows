import {Action} from 'redux';
import { setUserProfile, fetchUserProfile } from '../user/actions';
import {RootState} from '../index';
import {ThunkAction} from 'redux-thunk';

import axios, { AxiosResponse } from 'axios';
import { Profile, KnownUserAction } from '../user/types';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >


export const fetchUserProfileAsync = () : AppThunk => async (dispatch, getState) => {
    dispatch(fetchUserProfile.request());
    try {
        const asyncResp: AxiosResponse = await axios.get('profiles/me', {baseURL: "https://localhost:5001/api/", headers: { Authorization: `Bearer ${getState().system.token}` } });
        const profile = await asyncResp.data as Profile;
        console.log(profile);
        dispatch(fetchUserProfile.success(profile))
    } catch (e) {
        dispatch(fetchUserProfile.failure(e));
    }


}



