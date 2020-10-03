import {GameInfo, GameOptions, GameState, PlayerBoard, Tile} from "./types";

export type KnownGameActions =
    UpdateTileAction
    | UpdateTilesAction
    | UpdatePlayerBoardAction
    | UpdateGameInfoAction
    | UpdateGameOptionsAction
    | UpdateGameAction;

export const UPDATE_TILE = 'UPDATE_TILE';

export interface UpdateTileAction {
    type: typeof UPDATE_TILE;
    payload: { id: number, tile: Tile };
}

export const UPDATE_TILES = 'UPDATE_TILES';

export interface UpdateTilesAction {
    type: typeof UPDATE_TILES;
    payload: { id: number, tile: Tile }[];
}

export const UPDATE_PLAYER_BOARD = 'UPDATE_PLAYER_BOARD';

export interface UpdatePlayerBoardAction {
    type: typeof UPDATE_PLAYER_BOARD;
    payload: { id: string, playerBoard: PlayerBoard }
}

export const UPDATE_PLAYER_BOARDS = 'UPDATE_PLAYER_BOARDS';

export interface UpdatePlayerBoardsAction {
    type: typeof UPDATE_PLAYER_BOARDS;
    payload: { id: string, playerBoard: PlayerBoard }[];
}

export const UPDATE_GAME_INFO = 'UPDATE_GAME_INFO';

export interface UpdateGameInfoAction {
    type: typeof UPDATE_GAME_INFO;
    payload: GameInfo
}

export const UPDATE_GAME_OPTIONS = 'UPDATE_GAME_OPTIONS';

export interface UpdateGameOptionsAction {
    type: typeof UPDATE_GAME_OPTIONS;
    payload: GameOptions;
}

export const UPDATE_GAME = 'UPDATE_GAME';

export interface UpdateGameAction {
    type: typeof UPDATE_GAME;
    payload: GameState;
}


