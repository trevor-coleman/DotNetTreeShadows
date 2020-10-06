import {createSlice} from "@reduxjs/toolkit";
import {fetchInvitations, sendFriendRequest} from "./actions";
import {Invitation} from "./invitation";
import {RequestState} from "../../api/requestState";


export type InvitationsState = {
    friendRequests: Invitation[],
    sessionInvites: Invitation[],
    sendingFriendRequestState: RequestState,
    sendingFriendRequestFailureMessage: string|null,
    fetchingInvitations: boolean,
    fetchingInvitationsFailureMessage: string | null,
}

let initialInvitationState: InvitationsState = {
    sendingFriendRequestState: RequestState.Idle,
    sendingFriendRequestFailureMessage: null,
    fetchingInvitations: false,
    fetchingInvitationsFailureMessage: null,
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
            friendInvitations: action.payload.friendRequests,
            sessionInvites: action.payload.sessionInvites,
        })).addCase(fetchInvitations.rejected, (state, action) => ({
            ...state,
            fetchingInvitations: false,
            fetchingInvitationsFailureMessage: action.error.toString() || "fetchInvitations failed"
        }));

        builder.addCase(sendFriendRequest.pending, state => ({
            ...state, sendingFriendRequestState: RequestState.Pending, sendingFriendRequestFailureMessage: null
        })).addCase(sendFriendRequest.fulfilled, state => ({
            ...state, sendingFriendRequestState: RequestState.Fulfilled,
        })).addCase(sendFriendRequest.rejected, (state, action) => ({
            ...state, sendingFriendRequestState: RequestState.Rejected, sendingFriendRequestFailureMessage: action.error.toString() || "Failed to send friendRequest"
        }))
    },
    reducers: {},
    name: "invitations",
    initialState: initialInvitationState
})


export const {} = invitationsSlice.actions;
export {fetchInvitations, sendFriendRequest};
export default invitationsSlice.reducer;
