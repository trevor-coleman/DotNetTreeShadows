import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from '../../store'
import Api from "../../api/api";
import {ExtraInfo} from "../store";
import Game from "./types/game";
import {AxiosResponse} from "axios";


export const fetchGame = createAsyncThunk<Game, string, ExtraInfo>('game/fetchGame',
    async (sessionId, {extra}) => {
        const {api} = extra;
        const response = await api.game.get(sessionId);
        return response.data;
    });


export const sendTurnAction = ({sessionId, actionRequest}: { sessionId: string, actionRequest: ActionRequest }) => async (dispatch: AppDispatch) => {
    dispatch(sendTurnActionToApi(
        {
            sessionId,
            actionRequest

        }
    ));
}

export const sendTurnActionToApi = createAsyncThunk<any, { sessionId: string, actionRequest: ActionRequest }, ExtraInfo>('game/turnAction',
    async ({sessionId, actionRequest}, {extra}) => {
        const {api} = extra;
        const response = await api.game.sendAction({
            sessionId,
            actionRequest
        });
        return response.data;
    });


export interface ActionRequest {
    type: string,
    target?: number,
    origin?: number,
    pieceType?: string,
    actionId?: string,
    targetPlayerId?: string,
}

export enum GameActionType {
    Buy, Plant, Grow, Collect, EndTurn, StartGame, PlaceStartingTree, UndoAction, Resign, Kick,
}

