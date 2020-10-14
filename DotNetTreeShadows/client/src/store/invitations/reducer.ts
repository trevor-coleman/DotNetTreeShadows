import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    fetchInvitations,
    sendFriendRequest,
    sendManySessionInvites
} from "./actions";
import {Invitation} from "./types/invitation";
import {RequestState} from "../../api/requestState";
import {signOut} from "../auth/reducer";

export type InvitationsState = {
    invitations: Invitation[],
    friendRequests: Invitation[],
    sessionInvites: Invitation[],
    sendingFriendRequestState: RequestState,
    sendingFriendRequestFailureMessage: string | null,
    fetchingInvitations: boolean,
    fetchingInvitationsFailureMessage: string | null,
}

let initialInvitationState: InvitationsState = {
    sendingFriendRequestState: RequestState.Idle,
    sendingFriendRequestFailureMessage: null,
    fetchingInvitations: false,
    fetchingInvitationsFailureMessage: null,
    invitations: [],
    friendRequests: [],
    sessionInvites: []
};

const invitationsSlice = createSlice({
    extraReducers: builder => {
        builder.addCase(fetchInvitations.pending, (state) => ({
            ...state,
            fetchingInvitationsFailureMessage: null,
            fetchingInvitations: true,
        })).addCase(fetchInvitations.fulfilled, (state, action) => ({
            ...state,
            fetchingInvitations: false,
            friendRequests: action.payload.friendRequests,
            sessionInvites: action.payload.sessionInvites,
        })).addCase(fetchInvitations.rejected, (state, action) => ({
            ...state,
            fetchingInvitations: false,
            fetchingInvitationsFailureMessage: action.error.toString() || "fetchInvitations failed"
        }));

        builder.addCase(sendFriendRequest.pending, state => ({
            ...state,
            sendingFriendRequestState: RequestState.Pending,
            sendingFriendRequestFailureMessage: null
        })).addCase(sendFriendRequest.fulfilled, state => ({
            ...state,
            sendingFriendRequestState: RequestState.Fulfilled,
        })).addCase(sendFriendRequest.rejected, (state, action) => ({
            ...state,
            sendingFriendRequestState: RequestState.Rejected,
            sendingFriendRequestFailureMessage: action.error.toString() || "Failed to send friendRequest"
        }))

        builder.addCase(sendManySessionInvites.fulfilled, (state: InvitationsState, {payload}: PayloadAction<Invitation[]>) => {
            return {
                ...state,
                sessionInvites: [...state.sessionInvites, ...payload]
            }
        })
        builder.addCase(signOut, (state) => initialInvitationState);


    },
    reducers: {},
    name: "invitations",
    initialState: initialInvitationState
})


export const {} = invitationsSlice.actions;
export {fetchInvitations};
export default invitationsSlice.reducer;
