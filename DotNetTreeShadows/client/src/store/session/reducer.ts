import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Session, SessionUpdate} from './types'
import {RequestState} from "../../api/requestState";
import {createSession, fetchSessionFromApi} from "./actions";
import {createSessionAndFetchProfile, fetchSession} from './thunks'
import {sendManySessionInvites, updateInvitationStatus} from "../invitations/actions";
import {Invitation} from "../invitations/types/invitation";
import {signOut} from "../auth/reducer";
import {useTypedSelector} from "../index";


export interface SessionState extends Session {
  loadingSessionFailureMessage: string | null,
  loadingSessionState: RequestState,
  firstLoad: boolean,
  connectedPlayers: string[],
}

const initialSessionState: SessionState = {
  loadingSessionState: RequestState.Idle,
  loadingSessionFailureMessage: null,
  host: "",
  hostName: "",
  linkEnabled:true,
  id: "",
  invitations: [],
  invitedPlayers: [],
  name: "",
  players: {},
  firstLoad: true,
  connectedPlayers: [],
}

interface PendingAction<ArgType> {
  type: string
  payload: undefined
  meta: {
    requestId: string
    arg: ArgType
  }
}

const sessionSlice = createSlice({
  name: "session",
  extraReducers: builder => {
    builder.addCase(fetchSessionFromApi.pending, (state: SessionState) => {
      return {
        ...state,
        loadingSessionFailureMessage: null,
        loadingSessionState: RequestState.Pending
      };
    });

    builder.addCase(fetchSessionFromApi.fulfilled, (state: SessionState) => ({
      ...state,
      loadingSessionFailureMessage: null,
      loadingSessionState: RequestState.Fulfilled
    }));

    builder.addCase(
      fetchSessionFromApi.rejected,
      (state: SessionState, action) => ({
        ...state,
        loadingSessionFailureMessage: action.error.toString(),
        loadingSessionState: RequestState.Rejected
      })
    );

    builder.addCase(createSession.pending, (state: SessionState) => ({
      ...state,
      loadingSessionFailureMessage: null,
      loadingSessionState: RequestState.Pending
    }));

    builder.addCase(createSession.fulfilled, (state: SessionState) => ({
      ...state,
      loadingSessionFailureMessage: null,
      loadingSessionState: RequestState.Fulfilled
    }));

    builder.addCase(createSession.rejected, (state: SessionState, action) => ({
      ...state,
      loadingSessionFailureMessage: action.error.toString(),
      loadingSessionState: RequestState.Rejected
    }));

    builder.addCase(
      sendManySessionInvites.fulfilled,
      (state: SessionState, action: PayloadAction<Invitation[]>) => {
        const invitesToAdd = action.payload.filter(
          inv => inv.resourceId == state.id
        );
        const newInvitedPLayers = invitesToAdd.map(inv => inv.recipientId);
        const newInvitationIds = invitesToAdd.map(inv => inv.id);
        return {
          ...state,
          invitedPlayers: [...state.invitedPlayers, ...newInvitedPLayers],
          invitations: [...state.invitations, ...newInvitationIds]
        };
      }
    );

    builder.addCase(
      updateInvitationStatus.fulfilled,
      (state: SessionState, action: PayloadAction<Invitation>) => {
        const invitation = action.payload;
        if (invitation.resourceId !== state.id) return state;
        //TODO: Keep list of invited players who declined.
        if (
          invitation.status === "Declined" ||
          invitation.status === "Cancelled"
        ) {
          return {
            ...state,
            invitedPlayers: state.invitedPlayers.filter(
              id => id !== invitation.recipientId
            ),
            invitations: state.invitations.filter(id => id !== invitation.id)
          };
        }
      }
    );
    builder.addCase(signOut, state => initialSessionState);
  },
  initialState: initialSessionState,
  reducers: {
    updateSession: (
      state: SessionState,
      action: PayloadAction<SessionUpdate>
    ) => {
      console.log("updateSession :", action);

      return action.payload.session
        ? {
            ...state,
            ...action.payload.session,
            firstLoad: false
          }
        : state;
    },
    clearSession: state => {
      console.log("clearSession");
      return {
        ...initialSessionState
      };
    },
    updateConnectedPlayers(
      state: SessionState,
      action: PayloadAction<{ sessionId: string; connectedPlayers: string[] }>
    ) {
      const { sessionId, connectedPlayers } = action.payload;
      return sessionId == state.id
        ? {
            ...state,
            connectedPlayers
          }
        : state;
    },
    updateLinkEnabled(state, action: PayloadAction<{ sessionId: string, value:boolean }>) {
      const {sessionId, value} =  action.payload;
      return sessionId == state.id
        ? {
            ...state,
            linkEnabled: value
          }
        : state;
    }
  }
});

export const useSessionId = ()=>useTypedSelector(state=>state.session.id);
export const usePlayers=()=>useTypedSelector(state => state.session.players);

export const {updateSession, clearSession, updateConnectedPlayers, updateLinkEnabled} = sessionSlice.actions;
export {createSession, fetchSession, createSessionAndFetchProfile};
export default sessionSlice.reducer;

