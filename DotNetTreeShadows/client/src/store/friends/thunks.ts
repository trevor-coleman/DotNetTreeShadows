import axios, { AxiosResponse } from 'axios';
import { Profile } from '../user/types';
import { AppThunk } from '../middleware/thunks';
import { getFriends } from './actions';
import { FriendProfile } from './types';

export const getFriendsAsync = () : AppThunk => async (dispatch, getState) => {
    dispatch(getFriends.request());
    try {
        const asyncResp: AxiosResponse = await axios.get('profiles/', {baseURL: "https://localhost:5001/api/", headers: { Authorization: `Bearer ${getState().system.token}` } });
        const friends = await asyncResp.data as FriendProfile[];
        console.log(friends);
        dispatch(getFriends.success(friends))
    } catch (e) {
        dispatch(getFriends.failure(e.message));
    }
}
