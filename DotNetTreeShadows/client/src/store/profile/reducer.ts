import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchProfile} from "./actions";
import {RequestState} from "../../api/requestState";
import {Profile} from "./profile";
import {Action} from "typesafe-actions";

export interface SessionSummary {
    id: string,
    name:string,
}

export interface ProfileState extends Profile {
    loadingProfileState: RequestState;
    loadingProfileFailedMessage: string|null,
    sessionSummaries: SessionSummary[]
}

const initialProfileState : ProfileState = {
    sessionSummaries: [],
    id: "",
    name:"",
    email:"",
    friends: [],
    loadingProfileFailedMessage: null,
    loadingProfileState: RequestState.Idle,
    receivedInvitations: [],
    sentInvitations: [],
    sessions: []
};

const profileSlice = createSlice({
    extraReducers: builder => {
        builder.addCase(fetchProfile.pending, (state:ProfileState) => ({
            ...state,
            loadingProfileFailedMessage: null,
            loadingProfileState: RequestState.Pending
        }));

        builder.addCase(fetchProfile.fulfilled, (state:ProfileState, action:PayloadAction<Profile>) => ({
            ...state,
            ...action.payload,
            loadingProfileFailedMessage: null,
            loadingProfileState: RequestState.Fulfilled,
        }));

        builder.addCase(fetchProfile.rejected, (state:ProfileState, action) => ({
            ...state,
            loadingProfileFailedMessage: action.error.toString(),
            loadingProfileState: RequestState.Rejected,
        }));


    },
    reducers: {
        clearProfile:(state, action : Action)=>({...initialProfileState})
    },
    name: "profile",
    initialState: initialProfileState
})


export const {clearProfile} = profileSlice.actions;
export {fetchProfile};
export default profileSlice.reducer;
