import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Session, SessionUpdate} from './types'
import {RequestState} from "../../api/requestState";
import {createSession, fetchSessionFromApi} from "./actions";
import {createSessionAndFetchProfile, fetchSession} from './thunks'
import {Board} from "../board/types/board";
import Game from "../game/types/game";



export interface SessionState extends Session {
    loadingSessionFailureMessage: string|null,
    loadingSessionState: RequestState,
}

const initialSessionState: SessionState = {
    loadingSessionState: RequestState.Idle,
    loadingSessionFailureMessage: null,
    host: "",
    id: "",
    invitations: [],
    invitedPlayers:[],
    name: "",
    players: {}
}

interface PendingAction<ArgType> {
    type: string
    payload: undefined
    meta: {
        requestId: string
        arg: ArgType
    }};

const sessionSlice = createSlice({
    name: 'session',
    extraReducers: builder => {
        builder.addCase(fetchSessionFromApi.pending, (state:SessionState, action:PendingAction<string>) => {
            return ({
                ...state,
                loadingSessionFailureMessage: null,
                loadingSessionState: RequestState.Pending
            })
        });

        builder.addCase(fetchSessionFromApi.fulfilled, (state:SessionState, action:PayloadAction<Session>) => ({
            ...state,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Fulfilled,
        }));

        builder.addCase(fetchSessionFromApi.rejected, (state:SessionState, action) => ({
            ...state,
            loadingSessionFailureMessage: action.error.toString(),
            loadingSessionState: RequestState.Rejected,
        }));

        builder.addCase(createSession.pending, (state:SessionState) => ({
            ...state,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Pending
        }));

        builder.addCase(createSession.fulfilled, (state:SessionState, action:PayloadAction<Session>) => ({
            ...state,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Fulfilled,
        }));

        builder.addCase(createSession.rejected, (state:SessionState, action) => ({
            ...state,
            loadingSessionFailureMessage: action.error.toString(),
            loadingSessionState: RequestState.Rejected,
        }));
    },
    initialState: initialSessionState,
    reducers:{
        updateSession: (state: SessionState, action: PayloadAction<SessionUpdate>) => {
            return {
                ...state,
                ...action.payload.session
            }},
        clearSession:(state => ({
            ...initialSessionState
        }))
    }
});


export const {updateSession, clearSession} = sessionSlice.actions;
export {createSession, fetchSession, createSessionAndFetchProfile};
export default sessionSlice.reducer;

