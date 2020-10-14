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
            type: GameActionType.PlaceStartingTree,
            origin,
        }
    }

    public static BuyAction(pieceType: PieceType):IGameActionRequest {
        return {
            type: GameActionType.Buy,
            pieceType
        }
    }

    public static PlantAction(origin: number, target: number):IGameActionRequest {
        return {
            type: GameActionType.Plant,
            origin,
            target
        }
    }

    public static GrowAction(origin: number):IGameActionRequest {
        return {
            type: GameActionType.Grow,
            origin
        }
    }

    public static CollectAction(origin: number):IGameActionRequest {
        return {
            type: GameActionType.Collect,
            origin
        }
    }

    public static EndTurnAction():IGameActionRequest {
        return {
            type: GameActionType.EndTurn,
        }
    }
}

export interface IGameActionRequest {
    type: GameActionType,
    pieceType?: PieceType,
    target?: number,
    origin?: number,
    targetPlayerId?: string
}


actionFactory.StartGameAction();
