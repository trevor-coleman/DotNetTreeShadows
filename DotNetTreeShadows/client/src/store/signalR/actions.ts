import {connection} from "./listeners";
import enhancedStore, {ExtraInfo} from "../store";
import {createAsyncThunk} from "@reduxjs/toolkit";

const {store} = enhancedStore;

export const connectToSession = createAsyncThunk<void,string, ExtraInfo>('signalr/connectToSession',
    async (sessionId, {extra}:ExtraInfo) => {
    try {
        await connection.send("ConnectPlayer", {
            sessionId,
            playerId: store.getState().profile.id
        });
        return;
    } catch (e) {
        console.log(e);
        return e.message ?? "disconnect failed";
    }
    })

export const disconnectFromSession = createAsyncThunk<void,string, ExtraInfo>('signalr/disconnectFromSession',
    async (sessionId, {extra}:ExtraInfo) => {
        try {
            await connection.send("DisconnectPlayer", {
                sessionId,
                playerId: store.getState().profile.id
            });
            return;
        } catch (e) {
            console.log(e);
            return e.message ?? "disconnect failed";
        }
    })

