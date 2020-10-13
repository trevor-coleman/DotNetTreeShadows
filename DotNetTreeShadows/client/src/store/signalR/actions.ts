import {connection} from "./listeners";
import enhancedStore, {ExtraInfo} from "../store";
import {createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {SignInCredentials} from "../auth/types/signInCredentials";
import {AppDispatch} from "../index";
import {clearProfile, fetchProfile} from "../profile/reducer";
import {fetchInvitations} from "../invitations/actions";
import {signIn} from "../auth/actions";
import {GameOption} from "../game/types/GameOption";
import { gameOptionUpdate } from "../game/reducer";
import game from "../game/types/game";

const {store} = enhancedStore;

export const connectToSession = createAsyncThunk<void,string>('signalr/connectToSession',
    async (sessionId) => {
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


export const disconnectFromSession = createAsyncThunk<void,string>('signalr/disconnectFromSession',
    async (sessionId) => {
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


export const setGameOption = (gameOption:GameOption, value:boolean, sessionId:string) => async (dispatch: AppDispatch) => {
    await dispatch(sendGameOptionUpdate({gameOption,value,sessionId}));
    const newGameOptions = {
        ...store.getState().game.gameOptions,
        [gameOption]: value ? value : undefined
    }
    dispatch(gameOptionUpdate(newGameOptions))
};



export const sendGameOptionUpdate = createAsyncThunk<void, {gameOption: string, value: boolean, sessionId: string}>(
    'signalr/sendGameOptionsUpdate',
    async (request)=> {
        try {
            await connection.send("SetGameOption", request);
            return
        } catch (e) {
            console.log(e);
            return(e.message ?? "failed to update option")
        }
    }
)

