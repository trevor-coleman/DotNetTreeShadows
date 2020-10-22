import enhancedStore from "../../store";
import {GameActionType} from "../actions";
import {setActionOrigin} from "../reducer";
import {GameStatus} from "../types/GameStatus";
import actionFactory from '../../../gamehub/gameActions/ActionFactory';
import gameActions from "../../../gamehub/gameActions";
import Tile from "../../board/types/tile";
import playerBoard from "../types/playerBoard";
import PlayerBoard from "../types/playerBoard";
import {PieceType} from "../../board/types/pieceType";
import {TreeType} from "../../board/types/treeType";

const {store} = enhancedStore;

export type ActionStage =
  "selectingAction"
  | "selectingPiece"
  | "selectingTiles"
  | null

export async function handleTileClick(hexCode: number) {
  const {turnOrder, currentTurn, status, playerBoards} = store.getState().game
  const {currentActionType, currentActionStage, currentActionOrigin} = store.getState().game;
  const {id: sessionId} = store.getState().session;
  const {id: playerId} = store.getState().profile;
  const {tiles} = store.getState().board;

  if (currentActionStage == "selectingAction" || currentActionStage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

  if (status == GameStatus.PlacingFirstTrees || status == GameStatus.PlacingSecondTrees) {
    await gameActions.placeStartingTree(hexCode);
  }

  switch (currentActionType) {
    case GameActionType.Plant:
      if (currentActionOrigin == null) {
        if (Tile.GetTreeType(tiles[hexCode]) == PlayerBoard.TreeType(playerBoards[playerId])) {
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

export async function handlePlayerBoardClick(pieceType: PieceType) {
  console.log(`handleClick - ${pieceType} - ${store.getState().currentActionType}`)
  if(store.getState().game.currentActionType != GameActionType.Buy) return;

  await gameActions.buy(pieceType);


}
