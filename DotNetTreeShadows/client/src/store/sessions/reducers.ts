import {
  SessionState,
  KnownSessionAction,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST,
  GET_SESSION_REQUEST,
  GET_SESSION_FAILURE,
  GET_SESSION_SUCCESS,
} from './types';
import { normalize, schema } from 'normalizr';
import { ADD_PIECE_TO_HEX, CLEAR_PIECE_FROM_HEX } from './board/types';
import { HexCoordinates } from '../../models/hex-grid/HexCoordinates';

export const initialSessionState: SessionState = {
  session: null,
  sessionLoading: false,
  sessionLoadingFailureMessage: null,
};

export function sessionReducer(state: SessionState = initialSessionState, action: KnownSessionAction): SessionState {

  const indexOfHex = (hex: HexCoordinates): string => new HexCoordinates(hex.q, hex.r, hex.s).indexString();

  switch (action.type) {
    case CLEAR_PIECE_FROM_HEX:
      return {...state};
    case ADD_PIECE_TO_HEX:

      const game = state.session?.game;
      const board = state.session?.game.board;
      const tiles = state.session?.game.board.tiles;

      const payload = action.payload;
      const {hex, pieceType, treeType} = payload;
      const newHex = new HexCoordinates(hex.q, hex.r, hex.s);
      const hexString = newHex.indexString();

      console.log(hexString,
          tiles
          ? tiles[hexString]
          : "no tiles");

      return {
        ...state,
        session: state.session && game && board && tiles
                 ? {
              ...state.session,
              game: {
                ...game,
                board: {
                  ...board,
                  tiles: {
                    ...tiles,
                    [hexString]: {
                      ...tiles[hexString],
                      pieceType: action.payload.pieceType,
                      treeType: action.payload.treeType,
                    },
                  },
                },
              },
            }
                 : state.session,
      };
    case GET_SESSION_REQUEST:
      return {
        ...state,
        sessionLoading: true,
        sessionLoadingFailureMessage: null,
      };
    case GET_SESSION_SUCCESS:
      const playerBoard = new schema.Entity('playerBoards',{}, {idAttribute: (value, parent, key) => value.playerId })



      console.group("==========BEFORE")

      console.log(action.payload);
      console.groupEnd();

        console.group("============NORMALIZED")

      console.log(normalize(action.payload.game.playerBoards, new schema.Values(playerBoard)));
      console.groupEnd();

      return {
        ...state,
        session: action.payload,
        sessionLoading: false,
      };
    case GET_SESSION_FAILURE:
      return {
        ...state,
        sessionLoading: false,
        sessionLoadingFailureMessage: action.payload,
      };
    case CREATE_SESSION_REQUEST:
      return {
        ...state,
        sessionLoading: true,
        sessionLoadingFailureMessage: null,
      };
    case CREATE_SESSION_SUCCESS:
      return {
        ...state,
        session: action.payload,
        sessionLoading: false,
      };
    case CREATE_SESSION_FAILURE:
      return {
        ...state,
        sessionLoading: false,
        sessionLoadingFailureMessage: action.payload,
      };
    default:
      return {...state};
  }
}
