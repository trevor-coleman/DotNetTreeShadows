import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Message { sender:string, message:string }

interface SignalrState {
    messages: Message[];
    connectionStatus: string;
}

const initialSignalRState:SignalrState = {
    messages:[],
    connectionStatus: ""
}

const signalrSlice = createSlice({
    extraReducers: {},
    initialState: initialSignalRState,
    name: "signalR",
    reducers: {
        receiveMessage: (state:SignalrState, action:PayloadAction<Message>) => ({
            ...state,
            messages: [
                ...state.messages,
                action.payload
            ]
        }),
        setConnectionState: (state:SignalrState, {payload}:PayloadAction<string>)=>({
            ...state,
            connectionStatus: payload
        })
    }

})


export const {receiveMessage} = signalrSlice.actions;
export default signalrSlice.reducer;
