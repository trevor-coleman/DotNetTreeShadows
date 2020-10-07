import {createAsyncThunk, ThunkDispatch, unwrapResult} from "@reduxjs/toolkit";
import api from "../../api/api";
import {Session} from "./session";
import {SignInCredentials} from "../auth/signInCredentials";
import {RootState} from "../index";
import {clearProfile, fetchProfile} from "../profile/reducer";
import {AnyAction, signIn} from "../auth/actions";
import {fetchBoard} from "../board/reducer";
import {fetchGame} from "../game/actions";


export const createSession = createAsyncThunk(
    'session/createSession',
    async ():Promise<Session> => {
        const response = await api.createSession();
        return response.data;
    })

export const createSessionAndFetchProfile = () => async (dispatch: ThunkDispatch<RootState, any, AnyAction>) => {

    const session = unwrapResult(await dispatch(createSession()))
    await dispatch(fetchBoard(session.id))
    await dispatch(fetchProfile());
};

export const fetchSession = (id:string) => async (dispatch: ThunkDispatch<RootState, any, AnyAction>) => {
    dispatch(fetchSessionFromApi(id));
    dispatch(fetchBoard(id));
    dispatch(fetchGame(id));
};

export const fetchSessionFromApi = createAsyncThunk(
    'session/fetchSession',
    async (sessionId: string): Promise<Session> => {
        const response = await api.getSession(sessionId);
        return response.data;
    })


