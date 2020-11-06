import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBoard } from "./actions";
import { Board } from "./types/board";
import { updateSession } from "../session/reducer";
import { SessionUpdate } from "../session/types";
import { useTypedSelector } from "../index";
import { clearCurrentAction } from "../game/reducer";
import { GameOption } from "../game/types/GameOption";

const stateWithTileAtH = (
  state: BoardState,
  tile: number,
  h: number
): BoardState => ({
  ...state,
  tiles: {
    ...state.tiles,
    [h]: tile
  }
});

export interface BoardState extends Board {
  loadingBoard: boolean;
  loadingBoardRejectedMessage: string | null;
  displayTiles: { [hex: number]: number };
  treeTiles: number[];
  focusTiles: number[];
  originHexCode: number | null;
}

const initialBoardState: BoardState = {
  displayTiles: {},
  loadingBoard: false,
  loadingBoardRejectedMessage: null,
  tiles: {},
  treeTiles: [],
  focusTiles: [],
  originHexCode: null
};

const boardSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(fetchBoard.pending, state => ({
      ...state,
      loadingBoardFailedMessage: null,
      loadingTiles: false
    }));

    builder.addCase(fetchBoard.rejected, (state, action) => ({
      ...state,
      loadingBoardRejectedMessage:
        action.error.toString() || "Loading Board Failed",
      loadingTiles: false
    }));

    builder.addCase(fetchBoard.fulfilled, (state, action) => ({
      ...state,
      loadingBoardRejectedMessage: null,
      loadingTiles: false
    }));
    builder.addCase(
      updateSession,
      (state, action: PayloadAction<SessionUpdate>) => {
        const { board } = action.payload;
        return board
          ? {
              ...state,
              ...board
            }
          : state;
      }
    );
    builder.addCase(clearCurrentAction, state => ({
      ...state,
      focusTiles: [],
      originHexCode: null
    }));
  },
  reducers: {
    updateTiles: (state, action: PayloadAction<Board>) => ({
      ...state,
      ...action.payload
    }),
    updatedTreeTiles: (state, action: PayloadAction<number[]>) => ({
      ...state,
      treeTiles: [...action.payload]
    }),
    updateFocusTiles: (state, action: PayloadAction<number[]>) => ({
      ...state,
      focusTiles: [...action.payload]
    }),
    setActionOrigin: (
      state: BoardState,
      action: PayloadAction<number | null>
    ) => ({
      ...state,
      originHexCode: action.payload
    })
  },
  name: "board",
  initialState: initialBoardState
});

export const useTile = (hexCode: number) =>
  useTypedSelector(state => state.board.tiles[hexCode]);
export const useOrigin = ()=>useTypedSelector(state => state.board.originHexCode)
export const useFocus = () =>
  useTypedSelector(state => {
    const { focusTiles, originHexCode } = state.board;
    const preventActionsInShadow =
      state.game.gameOptions.indexOf("PreventActionsInShadow") !== -1;
    return {
      on: focusTiles && focusTiles.length > 0,
      tiles: focusTiles,
      originHexCode: originHexCode,
      isFocused: (hexCode: number) =>
        focusTiles &&
        focusTiles.length > 0 &&
        focusTiles.indexOf(hexCode) !== -1,
      shouldShadow: (hexCode: number) => {
        return (
          preventActionsInShadow ||
          (focusTiles.indexOf(hexCode) == -1 && hexCode !== originHexCode)
        );
      }
    };
  });

export const {
  updatedTreeTiles,
  updateFocusTiles,
  setActionOrigin
} = boardSlice.actions;
export { fetchBoard };
export default boardSlice.reducer;
