import enhancedStore from "../../store";
import handleTileClick from "./handleTileClick";
import handlePlayerBoardClick from "./handlePlayerBoardClick";
import { useTypedSelector } from '../../index';

export {handleTileClick, handlePlayerBoardClick}

const {store} = enhancedStore;

export type ActionStage =
  "selectingAction"
  | "selectingPiece"
  | "selectingTiles"
  | null
