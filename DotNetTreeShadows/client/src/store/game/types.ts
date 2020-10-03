export interface GameState {
    board: { [hexCode: number]:number}
    turnOrder: string[];
    firstPlayer: string;
    playerBoards: {[playerId:string]: PlayerBoard}
    currentTurn: number;
    revolution: number;
    round: number;
    sunPosition: SunPosition;
    longGame: boolean;
    preventActionsInShadow: boolean;
    randomizeTurnOrder: boolean;
    ScoreTokenStacks: {
    [leaves: number]: number[]
    }
}

export type GameInfo = {
    turnOrder: string[],
    firstPlayer: string,
    currentTurn: string,
    revolution: number,
    round: number,
    sunPosition: SunPosition,
}

export type GameOptions = {
    longGame: boolean;
    preventActionsInShadow: boolean;
    randomizeTurnOrder: boolean;
}

export type PlayerBoard = {
    playerId: string;
    treeType?: TreeType
    //TODO: Change to hold actual scoring tokens
    scoringTokens: ScoringToken[];
    pieces: { [pieceType: string]: PieceCount }
};

export interface IHexCoordinates {
    q: number,
    r: number,
    s: number,
    axialArray: number[],
}

export interface Tile {
    hexCoordinates: IHexCoordinates,
    pieceType: PieceType | null;
    treeType: TreeType | null;
    shadowHeight: 0;
}


export type SunPosition =
    "NorthWest"
    | "NorthEast"
    | "East"
    | "SouthEast"
    | "SouthWest"
    | "West";
export type TreeType =
    "Ash"
    | "Aspen"
    | "Birch"
    | "Poplar";

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
export type PieceType =
    "Seed"
    | "SmallTree"
    | "MediumTree"
    | "LargeTree"
