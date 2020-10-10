import {createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import  {AppDispatch} from '../../store'
import {Session} from "./types";

import {ExtraInfo} from "../store";


import {fetchBoard} from "../board/reducer";
import Api from "../../api/api";
import { updateSession } from "./reducer";
import {fetchProfile} from "../profile/reducer";
import {fetchGame} from "../game/reducer";
import {AxiosResponse} from "axios";
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



export const deleteSession = createAsyncThunk<string, string, ExtraInfo>(
    "session/deleteSession",
    async (sessionId, {extra})=>{
        const {api}=extra;
        const response = await api.session.delete(sessionId);
        return sessionId
    }
)



