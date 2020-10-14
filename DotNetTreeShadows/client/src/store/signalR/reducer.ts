import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HubConnectionState} from "@microsoft/signalr";
import {ConnectionMessage, getConnectionMessage} from "./connectionMessage";
import {signOut} from "../auth/reducer";


interface SignalrState {
  connectionState: HubConnectionState;
  connectionMessage: ConnectionMessage | null;
  connectedSession: string | null
  retryId: string | null;
  blacklist: string[];
}

const initialSignalRState: SignalrState = {
  connectionState: HubConnectionState.Disconnected,
  connectionMessage: ConnectionMessage.ConnectingToServer,
  connectedSession: null,
  retryId: null,
  blacklist: ['connectionState', 'connectionMessage', 'connectedToSession', 'retryId']
}

const signalrSlice = createSlice({
  extraReducers: builder=>{
    builder.addCase(signOut, () => initialSignalRState);
  },
  initialState: initialSignalRState,
  name: "signalR",
  reducers: {
    setConnectionState(state: SignalrState, {payload: connectionState}: PayloadAction<HubConnectionState>) {

      const currentState = state.connectionState;

      const connectionMessage = getConnectionMessage(currentState, connectionState)

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
    }
  }

})


export const {setConnectionState, retryConnection, retryTimeout, setConnectedSession} = signalrSlice.actions;
export default signalrSlice.reducer;
