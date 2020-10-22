import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SunPosition} from "./types/sunPosition";
import Game from "./types/game";
import {fetchGame, GameActionType} from "./actions";
import {updateSession} from "../session/reducer";
import {SessionUpdate} from "../session/types";
import {GameStatus} from "./types/GameStatus";
import {ActionStage} from "./gameActions";
import {IGameActionRequest} from "../../gamehub/gameActions/ActionFactory";
import {PieceType} from "../board/types/pieceType";
import {signOut} from "../auth/reducer";
import storage from 'redux-persist/lib/storage';
import persistReducer from "redux-persist/es/persistReducer";


export interface GameState extends Game {
  currentActionType: GameActionType | null,
  currentActionStage: ActionStage,
  currentActionOrigin: number | null,
  currentActionTarget: number | null,
  currentActionPieceType: PieceType | null,
  blacklist: string[]
}


const initialGameState: GameState = {
  currentTurn: 0,
  firstPlayer: "",
  gameOptions: {},
  playerBoards: {},
  revolution: 0,
  sunPosition: SunPosition.NorthWest,
  scores: {},
  scoringTokens: {},
  turnOrder: [],
  tilesActiveThisTurn: [],
  status: GameStatus.Preparing,
  currentActionType: null,
  currentActionStage: null,
  currentActionOrigin: null,
  currentActionTarget: null,
  currentActionPieceType: null,
  blacklist: ['currentActionType','currentActionStage', 'currentActionOrigin', 'currentActionTarget', 'currentActionPieceType']
}

const gameSlice = createSlice({
  name: 'game',
  extraReducers: builder => {
    builder.addCase(updateSession, (state, action: PayloadAction<SessionUpdate>) =>
      action.payload.game ? ({
        ...state,
        ...action.payload.game
      }) : state)
    builder.addCase(signOut, (state) => initialGameState);
  },
  initialState: initialGameState,
  reducers: {
    gameOptionUpdate: (state: GameState, action: PayloadAction<{ sessionId: string, gameOption: string, value: boolean }>) => {
      const {gameOption, value} = action.payload;
      return ({
        ...state,
        gameOptions: {
          ...state.gameOptions,
          [gameOption]: value || undefined,
        }
      });
    },
    setCurrentAction: (state, action: PayloadAction<GameActionType>) => ({
      ...state,
      currentActionType: action.payload

    }),
    setActionOrigin: (state: GameState, action: PayloadAction<number | null>) => ({
      ...state,
      currentActionOrigin: action.payload
    }),
    clearCurrentAction: state => ({
      ...state,
      currentActionType: null,
      currentActionStage: null,
      currentActionOrigin: null,
      currentActionTarget: null,
      currentActionPieceType: null,
    })

  }

})


export const {gameOptionUpdate, setActionOrigin, setCurrentAction, clearCurrentAction} = gameSlice.actions;
export {fetchGame};
export default gameSlice.reducer;

