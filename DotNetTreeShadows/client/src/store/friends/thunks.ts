import axios, { AxiosResponse } from 'axios';
import { AppThunk } from '../middleware/thunks';
import { getFriends, sendFriendRequest } from './actions';
import { FriendProfile } from './types';

export const getFriendsAsync = (): AppThunk => async (dispatch, getState) => {
    dispatch(getFriends.request());
    try {
        const asyncResp: AxiosResponse = await axios.get('profiles/me/friends',
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        const friends = await asyncResp.data as FriendProfile[];
        console.log(friends);
        dispatch(getFriends.success(friends));
    } catch (e) {
        dispatch(getFriends.failure(e.statusMessage));
    }
};

export const sendFriendRequestAsync = (email: string): AppThunk => async (dispatch, getState) => {
    dispatch(sendFriendRequest.request(email));
    try {
        await axios.post('profiles/me/friends', {email},
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        dispatch(sendFriendRequest.success());
    } catch (e) {
        dispatch(sendFriendRequest.failure(e?.response?.data?.message ?? e.statusMessage ));
    }
};

