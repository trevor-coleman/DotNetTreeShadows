import { GameStatus } from "../types/GameStatus";
import gameActions from "../../../gamehub/gameActions";
import { GameActionType } from "../actions";
import Tile from "../../board/types/tile";
import enhancedStore from "../../store";
import { setOrigin } from '../thunks';
import { TreeType } from '../../board/types/treeType';
import { showDiscardAlertDialog } from "../../appState/reducer";
import { PieceType } from '../../board/types/pieceType';
import PlayerBoard from '../types/playerBoard';

const {store} = enhancedStore;

export default async function handleTileClick(hexCode: number) {
  const {tiles, focusTiles, originHexCode} = store.getState().board;
  if (focusTiles.indexOf(hexCode) == -1 && originHexCode !== hexCode ) return;
  const {turnOrder, currentTurn, status, playerBoards} = store.getState().game
  const {currentActionType, currentActionStage} = store.getState().game;
  const {id: sessionId} = store.getState().session;
  const {id: playerId} = store.getState().profile;
  const playerBoard = store.getState().playerBoards[playerId];




  if (currentActionStage == "selectingAction" || currentActionStage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

  if (status == GameStatus.PlacingFirstTrees || status == GameStatus.PlacingSecondTrees) {
    await gameActions.placeStartingTree(hexCode);
    return
  }

  const tileCode: number = tiles[hexCode];
  const pieceType: PieceType = Tile.GetPieceType(tileCode)!;
  const getTreeType: TreeType | null = Tile.GetTreeType(tileCode);

  switch (currentActionType) {
    case GameActionType.Plant:
      if (originHexCode === null) {
        console.log("originHexCode is  null", getTreeType ? TreeType[getTreeType ?? TreeType.Poplar] : null);
        if (getTreeType == playerBoard.treeType) {
          store.dispatch(setOrigin(hexCode));
        }
        return;
      } else if (originHexCode === hexCode) {
        console.log("Dispatching null")
        store.dispatch(setOrigin(null));
        return
      }
      await gameActions.plant(originHexCode, hexCode)

      return;
    case GameActionType.Grow:
      const pieces = playerBoard.pieces[PieceType[pieceType]];
      console.log(pieces);
      if(pieces?.onPlayerBoard === PlayerBoard.spaces(pieceType)) {
        store.dispatch(setOrigin(hexCode));
        store.dispatch(showDiscardAlertDialog({
          open: true,
          pieceType: pieceType,
        }))
        return;
      }
      await gameActions.grow(hexCode);
      return;
    case GameActionType.Collect:
      await gameActions.collect(hexCode);
    case GameActionType.Buy:
    case GameActionType.EndTurn:
    case GameActionType.StartGame:
    case GameActionType.Undo:
    case GameActionType.Kick:
    case GameActionType.Resign:

    default:
      break;

  }

}
