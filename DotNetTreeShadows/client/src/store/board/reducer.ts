import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Tile} from "./types/tile";
import {fetchBoard} from "./actions";
import {Board} from "./types/board";
import {updateSession} from "../session/reducer";
import {SessionUpdate} from "../session/types";
import {AddPieceToTileRequest} from "../../gamehub";
import {signOut} from "../auth/reducer";
import enhancedStore from "../store";

const stateWithTileAtH = (state: BoardState, tile: number, h: number): BoardState => ({
  ...state,
  tiles: {
    ...state.tiles,
    [h]: tile
  }
})


export interface BoardState extends Board {
  loadingBoard: boolean;
  loadingBoardRejectedMessage: string | null;
  displayTiles: { [hex: number]: number }
}

const boardSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(fetchBoard.pending, (state) => ({
      ...state,
      loadingBoardFailedMessage: null,
      loadingTiles: false
    }));

    builder.addCase(fetchBoard.rejected, (state, action) => ({
      ...state,
      loadingBoardRejectedMessage: action.error.toString() || "Loading Board Failed",
      loadingTiles: false
    }));

    builder.addCase(fetchBoard.fulfilled, (state, action) =>
      ({
        ...state,
        loadingBoardRejectedMessage: null,
        loadingTiles: false,
      }));
    builder.addCase(updateSession,
      (state, action: PayloadAction<SessionUpdate>) => {
      return  action.payload.board
          ? ({
            ...state,
            ...action.payload.board
          })
          : state

  })

    builder.addCase(signOut, (state) => {
      }
    )

  },
  reducers: {
    updateTiles: (state, action: PayloadAction<Board>) => ({
      ...state,
      ...action.payload
    })

  },
  name: "board",
  initialState: {} as BoardState
})


export const {} = boardSlice.actions;
export {fetchBoard};
export default boardSlice.reducer;
