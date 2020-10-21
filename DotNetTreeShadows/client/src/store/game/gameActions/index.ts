import enhancedStore from "../../store";
import {GameActionType} from "../actions";
import {setActionOrigin} from "../reducer";
import {GameStatus} from "../types/GameStatus";
import actionFactory from '../../../gamehub/gameActions/ActionFactory';
import gameActions from "../../../gamehub/gameActions";
import Tile from "../../board/types/tile";
import playerBoard from "../types/playerBoard";
import PlayerBoard from "../types/playerBoard";

const {store} = enhancedStore;

export type ActionStage =
  "selectingAction"
  | "selectingPiece"
  | "selectingTiles"
  | null

export async function handleTileClick(hexCode: number) {
  const {turnOrder, currentTurn, status, playerBoards} = store.getState().game
  const {type, stage, origin, target} = store.getState().game.currentAction;
  const {id: sessionId} = store.getState().session;
  const {id: playerId} = store.getState().profile;
  const {tiles} = store.getState().board;

  console.log(sessionId);

  if (stage == "selectingAction" || stage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

  if (status == GameStatus.PlacingFirstTrees || status == GameStatus.PlacingSecondTrees) {
    await gameActions.placeStartingTree(hexCode);
  }

  switch (type) {
    case GameActionType.Plant:
      if (origin == null) {
        if (Tile.GetTreeType(tiles[hexCode]) == PlayerBoard.TreeType(playerBoards[playerId])) {
          store.dispatch(setActionOrigin(hexCode));
        }
        return;
      } else if (origin == hexCode) {
        store.dispatch(setActionOrigin(null));
        return
      }
      await gameActions.plant(origin, hexCode)
      store.dispatch(setActionOrigin(null));
      return;
    case GameActionType.Grow:
    case GameActionType.Buy:
    case GameActionType.EndTurn:
    case GameActionType.StartGame:
    case GameActionType.UndoAction:
    case GameActionType.Kick:
    case GameActionType.Resign:
    case GameActionType.Collect:
    default:
      console.log('not implemented')
      break;

  }

}
