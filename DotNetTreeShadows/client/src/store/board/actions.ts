import { ADD_PIECE_TO_HEX, CLEAR_PIECE_FROM_HEX, ClearPieceFromHexAction, AddPieceToHexAction } from './types';
import { HexCoordinates } from '../../models/hex-grid/HexCoordinates';
import { PieceType, TreeType } from '../sessions/types';
import { action, createAction } from 'typesafe-actions';

export const addPieceToHex =  createAction(ADD_PIECE_TO_HEX, (hex:HexCoordinates, pieceType:PieceType, treeType:TreeType)=>({hex, pieceType, treeType}) )

export const clearPieceFromHex = (hex: HexCoordinates) : ClearPieceFromHexAction => (
    {
      type: CLEAR_PIECE_FROM_HEX,
      payload: hex,
    });
