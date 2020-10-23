import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchProfile, removeFriendFromProfile, updateProfileAsync} from "./actions";
import {RequestState} from "../../api/requestState";
import {Profile} from "./types/profile";
import {Action} from "typesafe-actions";
import {deleteSession} from "../session/actions";
import {sendManySessionInvites} from "../invitations/actions";
import {Invitation} from "../invitations/types/invitation";
import { signOut } from "../auth/reducer";
import {useTypedSelector} from "../index";

export interface SessionSummary {
    id: string,
    name:string,
    host:string,
}

export interface ProfileState extends Profile {
    loadingProfileState: RequestState;
    loadingProfileFailedMessage: string|null,
    removingFriendState: RequestState;
    removingFriendErrorMessage: string|null,
    lastFriendRemoved: string|null;
}

const initialProfileState : ProfileState = {
    id: "",
    name:"",
    email:"",
    friends: [],
    loadingProfileFailedMessage: null,
    loadingProfileState: RequestState.Idle,
    receivedInvitations: [],
    sentInvitations: [],
    sessions: [],
    removingFriendState: RequestState.Idle,
    removingFriendErrorMessage: null,
    lastFriendRemoved: ""
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

        builder.addCase(removeFriendFromProfile.pending, (state:ProfileState) => ({
            ...state,
            loadingProfileFailedMessage: null,
            loadingProfileState: RequestState.Pending
        }));

        builder.addCase(removeFriendFromProfile.fulfilled, (state:ProfileState, action:Action) => ({
            ...state,
            removingFriendErrorMessage: null,
            removingFriendsState: RequestState.Fulfilled,
        }));

        builder.addCase(removeFriendFromProfile.rejected, (state:ProfileState, action) => ({
            ...state,
            removingFriendErrorMessage: action.error.toString(),
            removingFriendState: RequestState.Rejected,
        }));

        builder.addCase(deleteSession.fulfilled,  (state:ProfileState, action:PayloadAction<string>)=>({
            ...state,
            sessions: state.sessions.filter(sessionSummary=>sessionSummary.id!=action.payload)
        }))

        builder.addCase(sendManySessionInvites.fulfilled, ((state:ProfileState, action:PayloadAction<Invitation[]>) => {
            console.log(action.payload)
            return{...state}
        } ))

        builder.addCase(updateProfileAsync.fulfilled, (state:ProfileState, action:PayloadAction<Profile>) => ({
            ...state,
            ...action.payload
        }) )

        builder.addCase(signOut, (state) => initialProfileState);


    },
    reducers: {
        clearProfile:(state, action : Action)=>({...initialProfileState})
    },
    name: "profile",
    initialState: initialProfileState
})

export const useProfile = ()=> useTypedSelector(state=>state.profile)
export const usePlayerId = ()=> useTypedSelector(state=>state.profile.id)
export const useIsHost = ()=> useTypedSelector(state => state.profile.id == state.session.host)
export const useIsPlayersTurn = ()=> useTypedSelector(state => state.profile.id == state.game.turnOrder[state.game.currentTurn])

export const {clearProfile} = profileSlice.actions;
export {fetchProfile};
export default profileSlice.reducer;
