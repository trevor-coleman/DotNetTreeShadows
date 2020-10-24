import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SunPosition } from "./types/sunPosition";
import Game from "./types/game";
import { fetchGame, GameActionType } from "./actions";
import { updateSession } from "../session/reducer";
import { SessionUpdate } from "../session/types";
import { GameStatus } from "./types/GameStatus";
import { ActionStage } from "./gameActions";
import { PieceType } from "../board/types/pieceType";
import { signOut } from "../auth/reducer";
import { useTypedSelector } from "../index";
import { GameOption } from "./types/GameOption";

export interface GameState extends Game {
  revolutionAlertCount: number;
  turnAlertCount: number;
  currentActionType: GameActionType | null;
  currentActionStage: ActionStage;
  currentActionOrigin: number | null;
  currentActionTarget: number | null;
  currentActionPieceType: PieceType | null;
  blacklist: string[];
}

const initialGameState: GameState = {
  revolutionAlertCount: 0,
  turnAlertCount: -1,
  turnCount: 0,
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
  blacklist: [
    "currentActionType",
    "currentActionStage",
    "currentActionOrigin",
    "currentActionTarget",
    "currentActionPieceType"
  ]
};

const gameSlice = createSlice({
  name: "game",
  extraReducers: builder => {
    builder.addCase(
      updateSession,
      (state, action: PayloadAction<SessionUpdate>) =>
        action.payload.game
          ? {
              ...state,
              ...action.payload.game
            }
          : state
    );
    builder.addCase(signOut, state => initialGameState);
  },
  initialState: initialGameState,
  reducers: {
    gameOptionUpdate: (
      state: GameState,
      action: PayloadAction<{
        sessionId: string;
        gameOption: string;
        value: boolean;
      }>
    ) => {
      const { gameOption, value } = action.payload;
      return {
        ...state,
        gameOptions: {
          ...state.gameOptions,
          [gameOption]: value || undefined
        }
      };
    },
    setCurrentAction: (state, action: PayloadAction<GameActionType>) => ({
      ...state,
      currentActionType: action.payload
    }),
    setActionOrigin: (
      state: GameState,
      action: PayloadAction<number | null>
    ) => ({
      ...state,
      currentActionOrigin: action.payload
    }),
    clearCurrentAction: state => ({
      ...state,
      currentActionType: null,
      currentActionStage: null,
      currentActionOrigin: null,
      currentActionTarget: null,
      currentActionPieceType: null
    }),
    showedRevolutionAlert: (state, action: PayloadAction<number>) => ({
      ...state,
      revolutionAlertCount: action.payload
    }),
    playedEndTurnSound: (state, action: PayloadAction<number>) => ({
      ...state,
      turnAlertCount: action.payload
    }),

  }
});

export const useSunPosition = () =>
  useTypedSelector(state => state.game.sunPosition);
export const useGameStatus = () => useTypedSelector(state => state.game.status);
export const useTurnAlertCounts = () =>
  useTypedSelector(state => {
    return {
      count: state.game.revolutionAlertCount ?? 0,
      revolution: state.game.revolution,
      gameLength: state.game.gameOptions[GameOption.LongGame] ? 4 : 3,
      turnCount: state.game.turnCount,
      turnAlertCount: state.game.turnAlertCount,
    };
  });
export const useFirstPlayerName = () =>
  useTypedSelector(
    state => state.session.players[state.game.firstPlayer]?.name ?? ""
  );

export const useCollectedScoreTokens = (playerId?:string)=> useTypedSelector(state => state.game.scores[playerId ?? state.profile.id] ?? []);
export const useScoringTokenPiles = ()=> useTypedSelector(state => state.game.scoringTokens)
export const useScores = ()=>useTypedSelector(state => state.game.scores);

export const {
  gameOptionUpdate,
  setActionOrigin,
  setCurrentAction,
  clearCurrentAction,
  showedRevolutionAlert,
  playedEndTurnSound,

} = gameSlice.actions;
export { fetchGame };
export default gameSlice.reducer;
