import {createAsyncThunk} from "@reduxjs/toolkit";
import {Session} from "./types";

import {ExtraInfo} from "../extraInfo";


// import {fetchGame} from "../game/actions";



export const createSession = createAsyncThunk<Session, void,ExtraInfo>(
    'session/createSession',
    async (_, {extra}): Promise<Session> => {
        const {api} = extra;
        const response = await api.session.create();
        return response.data;
    })

export const fetchSessionFromApi = createAsyncThunk<Session, string, ExtraInfo>(
    "session/fetchSessionFromApi",
    async (sessionId:string, {extra}) => {
      const api = extra.api
        const response = await api.session.get(sessionId);
        return response.data;
    });

export const joinSession = createAsyncThunk<void, string, ExtraInfo>(
    "session/joinSession",
    async (sessionId: string, thunkApi) => {
      const {extra} = thunkApi;
      const api = extra.api;
      const response = await api.session.join(sessionId);
      if(response.status != 204) {
        console.log("Rejecting!")
                                  return thunkApi.rejectWithValue(response.data);
                                 }
      return response.data;

    });

export const deleteSession = createAsyncThunk<string, string, ExtraInfo>(
    "session/deleteSession",
    async (sessionId, {extra})=>{
        const {api}=extra;
        const response = await api.session.delete(sessionId);
        return sessionId
    }
)



