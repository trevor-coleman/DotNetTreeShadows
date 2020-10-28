import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    fetchInvitations,
    sendFriendRequest,
    sendManySessionInvites
} from "./actions";
import {Invitation} from "./types/invitation";
import {RequestState} from "../../api/requestState";
import {signOut} from "../auth/reducer";
import { useTypedSelector } from '../index';

interface RejectedAction<ThunkArg> {
  type: string
  payload: any
  error: any
  meta: {
    requestId: string
    arg: ThunkArg
    aborted: boolean
    condition: boolean
  }
}

export type InvitationsState = {
    invitations: Invitation[],
    friendRequests: Invitation[],
    sessionInvites: Invitation[],
    sendingFriendRequestState: RequestState,
    sendingFriendRequestFailureMessage: string | null,
    fetchingInvitations: boolean,
    fetchingInvitationsFailureMessage: string | null,
    blacklist: string[]
}

let initialInvitationState: InvitationsState = {
    sendingFriendRequestState: RequestState.Idle,
    sendingFriendRequestFailureMessage: null,
    fetchingInvitations: false,
    fetchingInvitationsFailureMessage: null,
    invitations: [],
    friendRequests: [],
    sessionInvites: [],
    blacklist: ["sendingFriendRequestState", "sendingFriendRequestFailureMessage"]
};

const invitationsSlice = createSlice({
  extraReducers: builder => {
    builder
      .addCase(fetchInvitations.pending, state => ({
        ...state,
        fetchingInvitationsFailureMessage: null,
        fetchingInvitations: true
      }))
      .addCase(fetchInvitations.fulfilled, (state, action) => ({
        ...state,
        fetchingInvitations: false,
        friendRequests: action.payload.friendRequests,
        sessionInvites: action.payload.sessionInvites
      }))
      .addCase(
        fetchInvitations.rejected,
        (state, action: RejectedAction<any>) => {
          return {
            ...state,
            fetchingInvitations: false,
            fetchingInvitationsFailureMessage:
              action.payload.toString() || "fetchInvitations failed"
          };
        }
      );

    builder
      .addCase(sendFriendRequest.pending, state => ({
        ...state,
        sendingFriendRequestState: RequestState.Pending,
        sendingFriendRequestFailureMessage: null
      }))
      .addCase(sendFriendRequest.fulfilled, state => ({
        ...state,
        sendingFriendRequestState: RequestState.Fulfilled
      }))
      .addCase(
        sendFriendRequest.rejected,
        (state, action: RejectedAction<string>) => ({
          ...state,
          sendingFriendRequestState: RequestState.Rejected,
          sendingFriendRequestFailureMessage:
            action.payload.toString() || "Failed to send friendRequest"
        })
      );

    builder.addCase(
      sendManySessionInvites.fulfilled,
      (state: InvitationsState, { payload }: PayloadAction<Invitation[]>) => {
        return {
          ...state,
          sessionInvites: [...state.sessionInvites, ...payload]
        };
      }
    );
    builder.addCase(signOut, state => initialInvitationState);
  },
  reducers: {
    resetFriendRequestState(state) {
      return ({
        ...state,
        sendingFriendRequestState: RequestState.Idle,
        sendingFriendRequestFailureMessage: null,
      })
    }
  },
  name: "invitations",
  initialState: initialInvitationState
});

export const useFriendRequestState = () =>
  useTypedSelector(state => ({
    state: state.invitations.sendingFriendRequestState,
    errorMessage: state.invitations.sendingFriendRequestFailureMessage
  }));

export const {resetFriendRequestState} = invitationsSlice.actions;
export {fetchInvitations};
export default invitationsSlice.reducer;
