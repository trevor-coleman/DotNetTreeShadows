import {SunPosition} from "./sunPosition";
import {ScoringToken} from "./scoringToken";
import {GameStatus} from "./GameStatus";

export default interface Game {
    status: GameStatus;
    turnOrder: string[];
    firstPlayer: string;
    playerBoards: { [playerId: string]: number }
    currentTurn: number;
    revolution: number;
    sunPosition: SunPosition;
    scoringTokens: {
        [leaves: number]: number[]
    },
    scores: {
        [playerId: string]: ScoringToken[]
    }
    gameOptions: {
        [option: string]: boolean | undefined,
    },
    tilesActiveThisTurn: number[],

}
