import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from '../../store'
import Game from "./types/game";
import {ExtraInfo} from "../extraInfo";
import { PieceType, pieceTypeName } from '../board/types/pieceType';


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
  Buy,
  Plant,
  Grow,
  Collect,
  EndTurn,
  StartGame,
  PlaceStartingTree,
  Undo,
  Resign,
  Kick,
}

export function actionTypeName (actionType?:GameActionType, pieceType?: PieceType ):string {
  switch (actionType) {
    case GameActionType.Plant:
      return "Plant Seed";
    case GameActionType.EndTurn:
      return "End Turn";
    case GameActionType.StartGame:
      return "Start Game"
    case GameActionType.PlaceStartingTree:
      return "Place Starting Tree"
    case GameActionType.Buy:
      return "Buy " + (pieceType !== undefined ? pieceTypeName(pieceType, true) :"");
    case GameActionType.Grow:
      return "Grow " + (
          pieceType
          ? pieceTypeName(pieceType, true)
          : "");
    case GameActionType.Collect:
    case GameActionType.Undo:
    case GameActionType.Kick:
    case GameActionType.Resign:
    default:
      return actionType !== undefined ? GameActionType[actionType] : "None";

  }
}

