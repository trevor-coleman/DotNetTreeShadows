import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SunPosition} from "../game/sunPosition";
import {Session} from './session'
import {fetchProfile} from "../profile/actions";
import {RequestState} from "../../api/requestState";
import {Profile} from "../profile/profile";
import {ProfileState} from "../profile/reducer";
import {fetchSession} from "./actions";


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
        builder.addCase(fetchSession.pending, (state:SessionState) => ({
            ...state,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Pending
        }));

        builder.addCase(fetchSession.fulfilled, (state:SessionState, action:PayloadAction<Session>) => ({
            ...state,
            ...action.payload,
            loadingSessionFailureMessage: null,
            loadingSessionState: RequestState.Fulfilled,
        }));

        builder.addCase(fetchSession.rejected, (state:SessionState, action) => ({
            ...state,
            loadingSessionFailureMessage: action.error.toString(),
            loadingSessionState: RequestState.Rejected,
        }));
    },
    initialState: initialSessionState,
    reducers: {}
})
