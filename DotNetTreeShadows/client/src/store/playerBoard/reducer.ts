import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TreeType} from "../board/types/treeType";
import {useTypedSelector} from "../index";
import {PieceType} from "../board/types/pieceType";
import PlayerBoard from "../game/types/playerBoard";
import {updateSession} from "../session/reducer";
import {SessionUpdate} from "../session/types";

export type PlayerBoardInfo = {
  boardCode: number | null,
  treeType: TreeType | null,
  light: number,
  pieces: {
    [key: string]: {
    available: number,
    onPlayerBoard: number,
      nextPrice:number,
  }
},
  lowestPrice: number,
}

export type PlayerBoardsState = {
  [playerId: string]: PlayerBoardInfo
}

const initialPlayerBoardState: PlayerBoardsState = {}

const stateFromBoardCode = (boardCode: number): PlayerBoardInfo => ({
  boardCode,
  light: PlayerBoard.GetLight(boardCode),
  lowestPrice: PlayerBoard.lowestPrice(boardCode),
  pieces: {
    LargeTree: {
      available: PlayerBoard.largeTrees(boardCode).available,
      onPlayerBoard: PlayerBoard.largeTrees(boardCode).onPlayerBoard,
      nextPrice: PlayerBoard.currentPrice(boardCode, PieceType.LargeTree),
    },
    MediumTree: {
      available: PlayerBoard.mediumTrees(boardCode).available,
      onPlayerBoard: PlayerBoard.mediumTrees(boardCode).onPlayerBoard,
      nextPrice: PlayerBoard.currentPrice(boardCode, PieceType.MediumTree),
    },
    Seed: {
      available: PlayerBoard.seeds(boardCode).available,
      onPlayerBoard: PlayerBoard.seeds(boardCode).onPlayerBoard,
      nextPrice: PlayerBoard.currentPrice(boardCode, PieceType.Seed),
    },
    SmallTree: {
      available: PlayerBoard.smallTrees(boardCode).available,
      onPlayerBoard: PlayerBoard.smallTrees(boardCode).onPlayerBoard,
      nextPrice: PlayerBoard.currentPrice(boardCode, PieceType.SmallTree),
    }
  },
  treeType: PlayerBoard.TreeType(boardCode)
})

const playerBoardsSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(updateSession, (state, action: PayloadAction<SessionUpdate>) => {
      if (!action.payload.game) return;
      const {playerBoards} = action.payload.game;

      let newState: PlayerBoardsState = {}

      for (let playerId in playerBoards) {
        const boardCode = playerBoards[playerId];
        newState[playerId] = stateFromBoardCode(boardCode);
      }
      return newState;

    });
  },
  initialState: initialPlayerBoardState,
  name: "PlayerBoard",
  reducers: {
    updatePlayerBoard: (state, action: PayloadAction<{ playerId: string, boardCode: number }>) => {
      const {playerId, boardCode} = action.payload;
      return {
        ...state,
        [playerId]: stateFromBoardCode(boardCode)
      }
    }
  }

})

export const useSelectPlayerBoard = (playerId: string) => useTypedSelector(state => state.playerBoards[playerId] ?? stateFromBoardCode(0));
export const usePlayerBoard = () => useTypedSelector(state => state.playerBoards[state.profile.id] ?? stateFromBoardCode(0));
export const usePlayerBoardPieceType = (pieceType:PieceType) => useTypedSelector(state => state.playerBoards[PieceType[pieceType]])
export const useLight= ()=>useTypedSelector(state => state.playerBoards[state.profile.id]?.light ?? 0);
export const useTreeType = ()=>useTypedSelector(state => state.playerBoards[state.profile.id].treeType ?? TreeType.Ash)

export const {updatePlayerBoard} = playerBoardsSlice.actions;
export default playerBoardsSlice.reducer;
