import gameHub from "../../gamehub";
import enhancedStore from "../store";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from "../index";
import {GameOption} from "../game/types/GameOption";
import {gameOptionUpdate, clearCurrentAction} from "../game/reducer";
import {GameHubMethod} from "../../gamehub/methods";
import {Invitation} from "../invitations/types/invitation";
import {IGameActionRequest} from "../../gamehub/gameActions/ActionFactory";
import session from "../../gamehub/listeners/session";
import { setConnectionState } from "./reducer";
import {HubConnectionState} from "@microsoft/signalr";
import {ExtraInfo} from "../extraInfo";

const {store} = enhancedStore;

export const connectToSession = createAsyncThunk<void, string>('gamehub/connectToSession',
    async (sessionId, thunkAPI) => {
        try {
            await gameHub.send(GameHubMethod.ConnectToSession, {
                sessionId,
                playerId: store.getState().profile.id
            });
            return;
        } catch (e) {
            console.error(e);
            thunkAPI.rejectWithValue( e.message ?? "connect to session failed")
        }
    })


export const sendDisconnectFromSession = createAsyncThunk<void, string>('gamehub/disconnectFromSession',
    async (sessionId, thunkApi) => {
        try {
            await gameHub.send(GameHubMethod.DisconnectFromSession, {
                sessionId,
                playerId: store.getState().profile.id
            });
            return;
        } catch (e) {
            thunkApi.rejectWithValue(e.message ?? "disconnect failed");
        }
    })


export const setGameOption = (gameOption: GameOption, value: boolean, sessionId: string) => async (dispatch: AppDispatch) => {
    await dispatch(sendGameOptionUpdate({
        gameOption,
        value,
        sessionId
    }));
    const newGameOptions = {
        ...store.getState().game.gameOptions,
        [gameOption]: value ? value : undefined
    }
    dispatch(gameOptionUpdate(newGameOptions))
};

export const cancelSessionInvite = (invitation: Invitation) => async (dispatch: AppDispatch) => {
    await dispatch(cancelSessionInviteAsync(invitation));
};


const cancelSessionInviteAsync = createAsyncThunk<void, Invitation, ExtraInfo>(
    'gamehub/cancelSessionInvite',
    async (invitation, thunkAPI) => {
        const result = await gameHub.send(GameHubMethod.CancelSessionInvite, invitation);
        console.log(result);
        return result;
    }
)

export const sendGameOptionUpdate = createAsyncThunk<void, { gameOption: string, value: boolean, sessionId: string }>(
    'gamehub/sendGameOptionsUpdate',
    async (request) => {
        try {
            await gameHub.send(GameHubMethod.SetGameOption, request);
            return
        } catch (e) {
            console.error(e.message);
            return (e.message ?? "failed to update option")
        }
    }
)

export const doGameAction = (sessionId:string, request: IGameActionRequest) => async (dispatch: AppDispatch) => {
  try {
        await dispatch(sendGameAction({
            sessionId,
            request
        }));
        dispatch (clearCurrentAction())
    } catch (e) {
        console.log(e);
    }
};

//TODO: REMOVE STRING FROM ENUM

const sendGameAction = createAsyncThunk<void, { sessionId: string, request: IGameActionRequest }>(
    "gamehub/doGameAction",
    async ({request, sessionId}) => {
      console.log(request);
      try {
            await gameHub.connection.send("DoAction", sessionId, request);
            return;
        } catch (e) {
            console.log(e);
            return e.message ?? "Failed to send DoGameAction";
        }
    }
)
