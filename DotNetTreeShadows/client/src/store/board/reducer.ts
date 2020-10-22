import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Tile} from "./types/tile";
import {fetchBoard} from "./actions";
import {Board} from "./types/board";
import {updateSession} from "../session/reducer";
import {SessionUpdate} from "../session/types";
import {signOut} from "../auth/reducer";
import PlayerBoard from "../game/types/playerBoard";


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
  displayTiles: { [hex: number]: number };
  treeTiles: number[];
}

const initialBoardState:BoardState = {
  displayTiles: {},
  loadingBoard: false,
  loadingBoardRejectedMessage: null,
  tiles: {},
  treeTiles: []

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
        const {board} = action.payload;
        return board
          ? ({
            ...state,
            ...board,
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
    }),
    updatedTreeTiles: (state, action:PayloadAction<number[]>) => ({
      ...state,
      treeTiles: [...action.payload]
    } )

  },
  name: "board",
  initialState: initialBoardState
})


export const {updatedTreeTiles} = boardSlice.actions;
export {fetchBoard};
export default boardSlice.reducer;
