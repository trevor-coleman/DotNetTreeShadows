import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchGame = createAsyncThunk('game/fetchGame',
    async (sessionId: string) => {
      const response = await api.game.getGame(sessionId);
      return response.data;
    });

export const sendTurnAction = createAsyncThunk('game/turnAction',
    async (turnActionParams: { sessionId: string, actionRequest: ActionRequest }) => {
      const response = await api.game.sendActionRequest(turnActionParams);
      return response.data;
    });

export interface ActionRequest {
  type: GameActionType,
  target?: number,
  origin?: number,
  pieceType?: string,
  actionId?: string,
  targetPlayerId?: string,
}

export enum GameActionType {
  Buy, Plant, Grow, Collect, EndTurn, StartGame, PlaceStartingTree, UndoAction, Resign, Kick,
}

