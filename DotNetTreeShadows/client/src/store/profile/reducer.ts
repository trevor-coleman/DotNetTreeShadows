import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchProfile} from "./actions";
import {RequestState} from "../../types/RequestState";
import {Profile} from "../../types/profile/profile";

export interface ProfileState extends Profile {
    loadingProfileState: RequestState;
    loadingProfileFailedMessage: string|null,
}

const initialProfileState : ProfileState = {
    Id: "",
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
    reducers: {},
    name: "profile",
    initialState: initialProfileState
})


export const {} = profileSlice.actions;
export {fetchProfile};
export default profileSlice.reducer;
