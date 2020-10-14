import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HubConnectionState} from "@microsoft/signalr";
import {ConnectionMessage, getConnectionMessage} from "./connectionMessage";



interface SignalrState {
    connectionState: HubConnectionState;
    connectionMessage:ConnectionMessage | null;
    retryId: string | null;
}

const initialSignalRState:SignalrState = {
    connectionState: HubConnectionState.Disconnected,
    connectionMessage: ConnectionMessage.ConnectingToServer,
    retryId: null,
}

const signalrSlice = createSlice({
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
        retryConnection(state, action:PayloadAction<string>) {
            return {
                ...state,
                connectionMessage: ConnectionMessage.ConnectingToServer,
                retryId: action.payload,
            }
        },
        retryTimeout(state, action:PayloadAction<string>) {
            if(action.payload != state.retryId) return state;
            return {
                ...state,
                connectionMessage: ConnectionMessage.ConnectionLost,
            }
        }
    }

})


export const {setConnectionState, retryConnection, retryTimeout} = signalrSlice.actions;
export default signalrSlice.reducer;
