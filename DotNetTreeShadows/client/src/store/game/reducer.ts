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


export interface GameState extends Game {
    currentAction: {
        type: GameActionType | null,
        stage: ActionStage,
        origin: number | null,
        target: number | null,
        pieceType: PieceType | null,
    }
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
    status: GameStatus.Preparing,
    currentAction: {
        type: null,
        stage: null,
        origin: null,
        target:null,
        pieceType: null
    }
}

const gameSlice = createSlice({
    name: 'game',
    extraReducers: builder => {
        builder.addCase(updateSession, (state, action:PayloadAction<SessionUpdate>)=>({
            ...state,
            ...action.payload.game
        }))
    },
    initialState: initialGameState,
    reducers: {
        gameOptionUpdate: (state:GameState, action:PayloadAction<{sessionId:string,gameOption:string, value:boolean}>) => {
            const {gameOption, value} = action.payload;
            return ({
                ...state,
                gameOptions: {
                    ...state.gameOptions,
                    [gameOption]: value || undefined,
                }
            });
        },
        setCurrentAction:(state, action:PayloadAction<GameActionType>) => ({
            ...state,
            currentAction: {
                ...state.currentAction,
                type: action.payload
            }

        }),
        setActionOrigin: (state:GameState, action:PayloadAction<number>) => ({
            ...state,
            currentAction: {
                ...state.currentAction,
                origin: action.payload
            }
        }),
        clearCurrentAction:state => ({
            ...state,
            currentAction: {
                ...initialGameState.currentAction
            }
        })
    }

})


export const {gameOptionUpdate, setActionOrigin, setCurrentAction, clearCurrentAction} = gameSlice.actions;
export {fetchGame};
export default gameSlice.reducer;
