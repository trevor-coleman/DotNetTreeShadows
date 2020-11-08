import { PieceType } from '../../board/types/pieceType';
import { GameActionType } from '../actions';

export interface GameActionData {
  id:string
  playerId: string
  origin?: number
  target?: number
  pieceType?: PieceType
  actionType?: GameActionType
}
