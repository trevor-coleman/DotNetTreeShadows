import {GameActionType} from "../../store/game/actions";
import {PieceType} from "../../store/board/types/pieceType";

export default class actionFactory {
  public static StartGameAction() {
    return {
      type: GameActionType.StartGame
    }
  }

  public static PlaceStartingTreeAction(origin: number): IGameActionRequest {
    return {
      pieceType: null,
      targetCode: null,
      targetPlayerId: null,
      type: GameActionType.PlaceStartingTree,
      originCode: origin
    }
  }

  public static BuyAction(pieceType: PieceType): IGameActionRequest {
    return {
      originCode: null,
      targetCode: null,
      targetPlayerId: null,
      type: GameActionType.Buy,
      pieceType: pieceType,
    }
  }

  public static PlantAction(origin: number, target: number): IGameActionRequest {
    return {
      pieceType: null,
      targetPlayerId: null,
      type: GameActionType.Plant,
      originCode: origin,
      targetCode: target
    }
  }

  public static GrowAction(origin: number): IGameActionRequest {
    return {
      pieceType: null,
      targetCode: null,
      targetPlayerId: null,
      type: GameActionType.Grow,
      originCode: origin
    }
  }

  public static CollectAction(origin: number): IGameActionRequest {
    return {
      pieceType: null,
      targetCode: null,
      targetPlayerId: null,
      type: GameActionType.Collect,
      originCode: origin
    }
  }

  public static EndTurnAction(): IGameActionRequest {
    return {
      originCode: null,
      pieceType: null,
      targetCode: null,
      targetPlayerId: null,
      type: GameActionType.EndTurn
    }
  }
}

export interface IGameActionRequest {
  type: GameActionType,
  pieceType?: PieceType | null,
  targetCode?: number | null,
  originCode?: number | null,
  targetPlayerId?: string | null
}


actionFactory.StartGameAction();
