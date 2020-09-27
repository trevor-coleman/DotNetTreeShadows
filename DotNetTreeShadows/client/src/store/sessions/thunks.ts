import { Session } from './types';
import { AppThunk } from '../middleware/thunks';
import { AxiosResponse } from 'axios';
import { getNewSession } from './actions';
import axios from 'axios';

export const getNewSessionAsync = (): AppThunk => async (dispatch, getState) => {
    dispatch(getNewSession.request());
    try {
        const asyncResp: AxiosResponse = await axios.get('sessions/new',
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        const newSession = await asyncResp.data as Session;
        dispatch(getNewSession.success(newSession));
    } catch (e) {
        dispatch(getNewSession.failure(e?.response?.data?.message ?? e.statusMessage));
    }
};
