export type KnownSessionAction = GetNewSessionAction;

export type SessionState = {
  session: Session
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
  scoringTokens: number[];
  pieces: Map<PieceType, PieceCount>
};

export interface Game {
  turnOrder: string[];
  firstPlayer: string;
  playerBoards: Map<string, PlayerBoard>
  currentTurn: number;
  Revolution: number;
  Round: number;
  SunPosition: SunPosition;
  Options : {
    longGame: boolean;
    preventActionsInShadow: boolean;
  }
  ScoreTokenStacks: {
    remaining: number[];
  }
};

export type SunPosition = "NorthWest"|"NorthEast"|"East"|"SouthEast"|"SouthWest"|"West";
export type TreeType = "Ash" |"Aspen" | "Poplar" | "Maple";

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

export const GET_NEW_SESSION_REQUEST ='GET_NEW_SESSION_REQUEST';
export const GET_NEW_SESSION_SUCCESS ='GET_NEW_SESSION_SUCCESS';
export const GET_NEW_SESSION_FAILURE ='GET_NEW_SESSION_FAILURE';

export interface GetNewSessionRequest {
    type: typeof GET_NEW_SESSION_REQUEST
}

export interface GetNewSessionSuccess {
    type: typeof GET_NEW_SESSION_SUCCESS
    payload: Session
}

export interface GetNewSessionFailure {
    type: typeof GET_NEW_SESSION_FAILURE
    payload: string
}

type GetNewSessionAction = GetNewSessionRequest | GetNewSessionSuccess | GetNewSessionFailure;
