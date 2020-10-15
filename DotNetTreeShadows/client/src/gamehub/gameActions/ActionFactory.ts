import {GameActionType} from "../../store/game/actions";
import {PieceType} from "../../store/board/types/pieceType";

export default class actionFactory {
    public static StartGameAction() {
        return {
          type: GameActionType.StartGame
        }
    }

    public static PlaceStartingTreeAction(origin: number):IGameActionRequest {
        return {
          pieceType: null,
          target: null,
          targetPlayerId: null,
          type: GameActionType.PlaceStartingTree,
            origin
        }
    }

    public static BuyAction(pieceType: PieceType):IGameActionRequest {
        return {
          origin: null,
          target: null,
          targetPlayerId: null,
          type: GameActionType.Buy,
            pieceType: PieceType[pieceType],
        }
    }

    public static PlantAction(origin: number, target: number):IGameActionRequest {
        return {
          pieceType: null,
          targetPlayerId: null,
          type: GameActionType.Plant,
            origin,
            target
        }
    }

    public static GrowAction(origin: number):IGameActionRequest {
        return {
          pieceType: null,
          target: null,
          targetPlayerId: null,
          type: GameActionType.Grow,
            origin
        }
    }

    public static CollectAction(origin: number):IGameActionRequest {
        return {
          pieceType: null,
          target: null,
          targetPlayerId: null,
          type: GameActionType.Collect,
            origin
        }
    }

    public static EndTurnAction():IGameActionRequest {
        return {
          origin: null,
          pieceType: null,
          target: null,
          targetPlayerId: null,
          type: GameActionType.EndTurn
        }
    }
}

export interface IGameActionRequest {
    type: string,
    pieceType?: string|null,
    target?: number|null,
    origin?: number|null,
    targetPlayerId?: string|null
}


actionFactory.StartGameAction();
