import { HexCoordinates } from '../../models/hex-grid/HexCoordinates';
import { PieceType, TreeType } from '../sessions/types';

export type KnownBoardAction = AddPieceToHexAction | ClearPieceFromHexAction;

export const ADD_PIECE_TO_HEX = 'ADD_PIECE_TO_HEX';

export interface AddPieceToHexAction {
  type: typeof ADD_PIECE_TO_HEX;
  payload: {
    hex: HexCoordinates,
    pieceType: PieceType;
    treeType: TreeType;
  }
}

export const CLEAR_PIECE_FROM_HEX = 'CLEAR_PIECE_FROM_HEX';

export interface ClearPieceFromHexAction {
  type: typeof CLEAR_PIECE_FROM_HEX;
  payload: HexCoordinates;
}


