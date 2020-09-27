import { Session } from './types';
import { AppThunk } from '../middleware/thunks';
import { AxiosResponse } from 'axios';
import { createSession, getSession } from './actions';
import axios from 'axios';
import { getSessionsInfoAsync } from '../user/thunks';

export const createSessionAsync = (): AppThunk => async (dispatch, getState) => {
    dispatch(createSession.request());
    try {
        const asyncResp: AxiosResponse = await axios.post('sessions',null,
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        const newSession = await asyncResp.data as Session;
        dispatch(createSession.success(newSession));
       dispatch(getSessionsInfoAsync());
    } catch (e) {
      console.log(e);
        dispatch(createSession.failure(e?.response?.data?.message ?? e.statusMessage));
    }
};

export const getSessionAsync = (id:string): AppThunk => async (dispatch, getState) => {
    dispatch(getSession.request(id));
    try {
        const asyncResp: AxiosResponse = await axios.get(`sessions/${id}`,
            {
                baseURL: "https://localhost:5001/api/",
                headers: {Authorization: `Bearer ${getState().system.token}`},
            });
        const session = await asyncResp.data as Session;
        dispatch(getSession.success(session));
    } catch (e) {
        dispatch(getSession.failure(e?.response?.data?.message ?? e.statusMessage));
    }
};
