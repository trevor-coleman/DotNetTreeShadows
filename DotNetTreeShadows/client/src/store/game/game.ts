import {SunPosition} from "./sunPosition";
import {ScoringToken} from "./scoringToken";

export default interface Game {
    board: { [hexCode: number]: number }
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
        [option: string]: boolean
    }
}
