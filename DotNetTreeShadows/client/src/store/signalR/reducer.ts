import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HubConnectionState} from "@microsoft/signalr";
import {ConnectionMessage, getConnectionMessage} from "./connectionMessage";
import {signOut} from "../auth/reducer";
import uuid from 'uuid-random'
import {GameActionType} from "../game/actions";
import {
  clearSession,
  updateSession,
  updateConnectedPlayers
} from "../session/reducer";
import { SessionUpdate } from '../session/types';


export interface SignalrState {
  connectionState: HubConnectionState;
  connectionMessage: ConnectionMessage | null;
  connectedSession: string | null
  retryId: string | null;
  sendingAction: boolean;
  lastActionId: string | null;
  blacklist: string[];
}

const initialSignalRState: SignalrState = {
  connectionState: HubConnectionState.Disconnected,
  connectionMessage: ConnectionMessage.ConnectingToServer,
  connectedSession: null,
  retryId: null,
  sendingAction: false,
  lastActionId: null,
  blacklist: ['connectionState', 'connectionMessage', 'connectedToSession', 'retryId', 'sendingAction']
}

const signalrSlice = createSlice({
  extraReducers: builder=>{
    builder.addCase(signOut, () => initialSignalRState);
    builder.addCase(clearSession, (state)=> ({
      ...state,
      connectedSession: null,
      connectionMessage: ConnectionMessage.ConnectingToServer,
    }))
    builder.addCase(updateSession, (state, action: PayloadAction<SessionUpdate>)=>{
      const {sessionId} = action.payload;
      return {
        ...state,
        connectedSession: sessionId,
        connectionMessage: null,
      }
    })
  },
  initialState: initialSignalRState,
  name: "signalR",
  reducers: {
    setConnectionState(state: SignalrState, {payload: connectionState}: PayloadAction<HubConnectionState>) {

      const currentState = state.connectionState;

      const connectionMessage = getConnectionMessage(currentState, connectionState)
      console.log(`SET CONNECTION - ${currentState} - ${connectionMessage}`)
      return {
        ...state,
        connectionState,
        connectionMessage,
        retryId: null,
      };
    },
    retryConnection(state, action: PayloadAction<string>) {
      return {
        ...state,
        connectionMessage: ConnectionMessage.ConnectingToServer,
        retryId: action.payload,
      }
    },
    retryTimeout(state, action: PayloadAction<string>) {
      if (action.payload != state.retryId) return state;
      return {
        ...state,
        connectionMessage: ConnectionMessage.ConnectionLost,
      }
    },
    setConnectedSession(state, action:PayloadAction<string|null>) {
      return {
        ...state,
        connectedSession: action.payload
      }
    },
    sentGameAction(state, action:PayloadAction<{type: GameActionType, context?: {[key:string]:any}}>) {
      return {...state }
    },
  }

})


export const {setConnectionState, retryConnection, retryTimeout, setConnectedSession, sentGameAction} = signalrSlice.actions;
export default signalrSlice.reducer;
