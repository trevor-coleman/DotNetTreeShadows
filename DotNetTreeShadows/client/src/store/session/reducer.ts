import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Session} from './session'
import {RequestState} from "../../api/requestState";
import {createSession, createSessionAndFetchProfile, fetchSession, fetchSessionFromApi} from "./actions";


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
    name: "",
    players: {}
}

const sessionSlice = createSlice({
    name: 'session',
    extraReducers: builder => {
        builder.addCase(fetchSessionFromApi.pending, (state:SessionState) => ({
            ...state,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Pending
        }));

        builder.addCase(fetchSessionFromApi.fulfilled, (state:SessionState, action:PayloadAction<Session>) => ({
            ...state,
            ...action.payload,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Fulfilled,
        }));

        builder.addCase(fetchSessionFromApi.rejected, (state:SessionState, action) => ({
            ...state,
            loadingSessionFailureMessage: action.error.toString(),
            loadingSessionState: RequestState.Rejected,
        }));
    },
    initialState: initialSessionState,
    reducers: {}
})


export const {} = sessionSlice.actions;
export {createSession, fetchSession, createSessionAndFetchProfile};
export default sessionSlice.reducer;

