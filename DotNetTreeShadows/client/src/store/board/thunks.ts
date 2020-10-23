import {TreeType} from "./types/treeType";
import PlayerBoard from "../game/types/playerBoard";
import Tile from "./types/tile";
import {updatedTreeTiles} from "./reducer";
import {AppDispatch} from "../index";
import {RootState} from "../store";


export const updateTreeTiles = () => async (dispatch: AppDispatch, getState: ()=>RootState) => {
  const {tiles} = getState().board;
  const {id:playerId} = getState().profile;
  const {playerBoards} = getState().game;

  const boardCode = playerBoards[playerId];
  const treeTiles: number[] = [];
  console.log(`UPDATING TREE TILES -- ${TreeType[PlayerBoard.TreeType(boardCode)]}`)

  for(let tile in tiles) {
    if(tiles.hasOwnProperty(tile) && Tile.GetTreeType(tiles[tile]) == PlayerBoard.TreeType(boardCode)) {
      treeTiles.push(parseInt(tile));
    }
  }
  dispatch(updatedTreeTiles(treeTiles))
}

