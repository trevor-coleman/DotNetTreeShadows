import {GameStatus} from "../types/GameStatus";
import gameActions from "../../../gamehub/gameActions";
import {GameActionType} from "../actions";
import Tile from "../../board/types/tile";
import PlayerBoard from "../types/playerBoard";
import {setActionOrigin} from "../reducer";
import enhancedStore from "../../store";

const {store} = enhancedStore;

export default async function handleTileClick(hexCode: number) {
  const {turnOrder, currentTurn, status, playerBoards} = store.getState().game
  const {currentActionType, currentActionStage, currentActionOrigin} = store.getState().game;
  const {id: sessionId} = store.getState().session;
  const {id: playerId} = store.getState().profile;
  const playerBoard = store.getState().playerBoards[playerId];
  const {tiles} = store.getState().board;

  if (currentActionStage == "selectingAction" || currentActionStage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

  if (status == GameStatus.PlacingFirstTrees || status == GameStatus.PlacingSecondTrees) {
    await gameActions.placeStartingTree(hexCode);
  }

  switch (currentActionType) {
    case GameActionType.Plant:
      if (currentActionOrigin == null) {
        if (Tile.GetTreeType(tiles[hexCode]) == playerBoard.treeType) {
          store.dispatch(setActionOrigin(hexCode));
        }
        return;
      } else if (currentActionOrigin == hexCode) {
        store.dispatch(setActionOrigin(null));
        return
      }
      await gameActions.plant(currentActionOrigin, hexCode)

      return;
    case GameActionType.Grow:
      await gameActions.grow(hexCode);
      return;
    case GameActionType.Collect:
      await gameActions.collect(hexCode);
    case GameActionType.Buy:
    case GameActionType.EndTurn:
    case GameActionType.StartGame:
    case GameActionType.UndoAction:
    case GameActionType.Kick:
    case GameActionType.Resign:

    default:
      break;

  }

}
