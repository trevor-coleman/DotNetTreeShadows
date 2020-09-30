import { HexCoordinates } from '../../models/hex-grid/HexCoordinates';
import { KnownBoardAction } from './board/types';

export type KnownSessionAction = CreateNewSessionAction | GetSessionAction | KnownBoardAction;

export type SessionState = {
  session: Session | null;
  sessionLoading: boolean;
  sessionLoadingFailureMessage: string | null;
}

export type Session = {
  id:string;
  host:string;
  players: Map<string, PlayerBoard>
  game: Game
  name: string;
  invitations: string[];
}

export type PlayerBoard = {
  playerId: string;
  treeType?: TreeType
  //TODO: Change to hold actual scoring tokens
  scoringTokens: number[];
  pieces: { [pieceType: string]: PieceCount }
};

export interface IHexCoordinates {
  q: number,
  r: number,
  s: number,
  axialArray: number[],
}

export interface Tile {
  hexCoordinates: HexCoordinates,
  pieceType: PieceType | null;
  treeType: TreeType | null;
  shadowHeight:0;
}

export interface Board {
  treeTiles: HexCoordinates[];
  tiles: {[hex: string]: Tile}
  sunPosition: SunPosition;
}

export interface Game {
  board: Board;
  turnOrder: string[];
  firstPlayer: string;
  playerBoards: PlayerBoard[];
  currentTurn: number;
  revolution: number;
  round: number;
  sunPosition: SunPosition;
  options : {
    longGame: boolean;
    preventActionsInShadow: boolean;
  }
  ScoreTokenStacks: {
    remaining: number[];
  }
};

export type SunPosition = "NorthWest"|"NorthEast"|"East"|"SouthEast"|"SouthWest"|"West";
export type TreeType = "Ash" |"Aspen" |"Birch"| "Poplar";

export type ScoringToken = {
  leaves: number,
  points: number
}


export type PieceCount = {
  pieceType: PieceType,
    available: number,
    onPlayerBoard: number,
    discarded: number,
  prices: number[]
}
export type PieceType= "Seed"|"SmallTree"|"MediumTree"|"LargeTree"

export const CREATE_SESSION_REQUEST ='CREATE_SESSION_REQUEST';
export const CREATE_SESSION_SUCCESS ='CREATE_SESSION_SUCCESS';
export const CREATE_SESSION_FAILURE ='CREATE_SESSION_FAILURE';

export interface CreateSessionRequest {
    type: typeof CREATE_SESSION_REQUEST
}

export interface CreateSessionSuccess {
    type: typeof CREATE_SESSION_SUCCESS
    payload: Session
}

export interface CreateSessionFailure {
    type: typeof CREATE_SESSION_FAILURE
    payload: string
}

type CreateNewSessionAction = CreateSessionRequest | CreateSessionSuccess | CreateSessionFailure;

export const GET_SESSION_REQUEST ='GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS ='GET_SESSION_SUCCESS';
export const GET_SESSION_FAILURE ='GET_SESSION_FAILURE';

export interface GetSessionRequest {
    type: typeof GET_SESSION_REQUEST
    payload: string;
}

export interface GetSessionSuccess {
    type: typeof GET_SESSION_SUCCESS
    payload: Session;
}

export interface GetSessionFailure {
    type: typeof GET_SESSION_FAILURE
    payload: string
}

type GetSessionAction = GetSessionRequest | GetSessionSuccess | GetSessionFailure;



