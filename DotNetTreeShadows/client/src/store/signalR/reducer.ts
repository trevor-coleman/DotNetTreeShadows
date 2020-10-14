import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HubConnectionState} from "@microsoft/signalr";


interface SignalrState {
    connectionState: HubConnectionState;
    sessionDisconnected: boolean,
}

const initialSignalRState:SignalrState = {
    connectionState: HubConnectionState.Disconnected,
    sessionDisconnected: false
}

const signalrSlice = createSlice({
    initialState: initialSignalRState,
    name: "signalR",
    reducers: {
        setConnectionState(state: SignalrState, {payload}: PayloadAction<HubConnectionState>) {
            return {
                ...state,
                connectionState: payload,
                sessionDisconnected: payload != HubConnectionState.Connecting || HubConnectionState.Connected ? false: state.sessionDisconnected,
            };
        },
        setSessionDisconnected: (state:SignalrState, {payload}:PayloadAction<boolean>)=>({
            ...state,
            sessionDisconnected: payload
        })
    }

})


export const {setConnectionState, setSessionDisconnected} = signalrSlice.actions;
export default signalrSlice.reducer;
