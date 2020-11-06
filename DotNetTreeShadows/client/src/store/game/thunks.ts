import { Hex } from "../board/types/Hex";
import { GameStatus } from "./types/GameStatus";
import { Tile } from "../board/types/tile";
import { GameOption } from "./types/GameOption";
import { GameActionType } from "./actions";
import { PieceType } from "../board/types/pieceType";
import enhancedStore, { RootState } from "../store";
import { AppDispatch } from "../index";
import { updateFocusTiles, setActionOrigin } from "../board/reducer";
import { setCurrentAction } from "./reducer";

const getState = enhancedStore.store.getState;

export const setOrigin = (hexCode:number|null) => async (dispatch: AppDispatch) => {
  console.log("setOrigin: " , hexCode);
  dispatch(setActionOrigin(hexCode));
  dispatch(updateFocus());
}



export const setGameAction = (currentActionType: GameActionType) => (dispatch: AppDispatch) => {
  dispatch(setCurrentAction(currentActionType))
  dispatch(updateFocus())
}

  export const updateFocus = () => (dispatch: AppDispatch) => {
  
  const state: RootState = getState();
  const {turnOrder, currentTurn, currentActionType, tilesActiveThisTurn, gameOptions, status} = state.game;
  const {id: playerId} = state.profile;
  const playerBoard = state.playerBoards[playerId];
  const originHexCode = state.board.originHexCode;
  const tiles = state.board.tiles;

  


  const isEligible = (hexCode: number): boolean => {

    const hex = new Hex(hexCode);
    const tileCode = tiles[hexCode];
    const treeType = Tile.GetTreeType(tileCode);
    const originTile = originHexCode !== null ? tiles[originHexCode] : null


    if (turnOrder[currentTurn] !== playerId) return false;
    if (Hex.IsSky(hexCode)) {
                              return false;
                            }

    if (
      status === GameStatus.PlacingFirstTrees ||
      status === GameStatus.PlacingSecondTrees
    ) {
      return (
        Hex.IsOnEdge(hexCode) &&
        Tile.IsEmpty(tileCode) &&
        !(
          gameOptions.indexOf("PreventActionsInShadow") !== -1 &&
          Tile.IsShadowed(tileCode)
        )
      );
    }
    const pieceHeight = Tile.GetPieceHeight(tileCode);
    if (currentActionType == GameActionType.Grow) {
      return Tile.TreeTypeIs(tileCode, playerBoard.treeType) && pieceHeight <
             3 && pieceHeight + 1 <= playerBoard.light && (
                 playerBoard.pieces[PieceType[pieceHeight + 1]]?.available ??
                 0) > 0 && tilesActiveThisTurn.indexOf(hexCode) == -1;
    }

    if (currentActionType == GameActionType.Plant) {
      if (originHexCode === null) {
        return pieceHeight > 0 && playerBoard.treeType == treeType &&
               tilesActiveThisTurn.indexOf(hexCode) == -1;
      }
      else {
        const distance = Hex.Distance(new Hex(originHexCode), hex);
        const originHeight = originTile !==null ? Tile.GetPieceHeight(originTile) : 0;
        return distance <= originHeight && (distance > 0) && Tile.IsEmpty(tileCode);
      }
    }

    if (currentActionType == GameActionType.Collect) {
      return pieceHeight == 3 && playerBoard.treeType == treeType &&
             tilesActiveThisTurn.indexOf(hexCode) == -1;
    }

    return false;

  }
    
  const focusTiles = Object.keys(tiles)
    .map(key => parseInt(key))
    .filter(h => isEligible(h));

  dispatch(updateFocusTiles(focusTiles))
}


