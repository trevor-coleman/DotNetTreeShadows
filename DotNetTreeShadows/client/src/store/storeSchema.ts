import {Tile, TreeType, ScoringToken, SunPosition} from './sessions/types';

export type PlayerId = string;
export type SessionId = string;

export type SessionState = {
        id: SessionId,
        host: PlayerId,
        longGame: boolean,
        preventActionInShadow: boolean,
    };

export type GameState = {
        turnOrder: PlayerId[];
        firstPlayer: string;
        currentTurn: number;
        revolution: number;
        round: number;
        sunPosition: SunPosition;
    }
export type BoardState = {
    game: {
        [hexAddress: string]: Tile
    },
    display: {
        [hexAddress: string]: Tile
    }
}

export type PlayersState = {
        byId: {
            [playerId: string]: {
                treeType: TreeType,
                scoringTokens: ScoringToken[],
                light: number;
                SmallTree: {
                    display: {}

                pieces: {
                    [pieceType: string]: {
                        available: number, onPlayerBoard: number, discarded: number,
                    }
                },
                displayPieces: {
                    [pieceType: string]: {
                        available: number, onPlayerBoard: number, discarded: number,
                    }
                }
            }
        }
    }

}
