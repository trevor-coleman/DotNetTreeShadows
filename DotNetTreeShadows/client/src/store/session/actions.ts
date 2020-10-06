import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";
import {Session} from "./session";


export const createSession = createAsyncThunk(
    'session/createSession',
    async ():Promise<Session> => {
        const response = await api.createSession();
        return response.data;
    })

export const fetchSession = createAsyncThunk(
    'session/fetchSession',
    async (sessionId: string): Promise<Session> => {
        const response = await api.getSession(sessionId);
        return response.data;
    })


