import {SunPosition} from "./sunPosition";
import {ScoringToken} from "./scoringToken";
import {GameStatus} from "./GameStatus";
import { GameOption } from './GameOption';
import { GameActionData } from './GameActionData';

export default interface Game {
    status: GameStatus;
    turnCount: number;
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
    gameOptions: GameOption[],
    tilesActiveThisTurn: number[],
  undoActions: GameActionData[],
  actionHistory: GameActionData[],

}
