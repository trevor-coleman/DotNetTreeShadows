import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SunPosition} from "./types/sunPosition";
import Game from "./types/game";
import {fetchGame} from "./actions";
import {updateSession} from "../session/reducer";
import {SessionUpdate} from "../session/types";
import {GameStatus} from "./types/GameStatus";


export interface GameState extends Game {
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
    status: GameStatus.Preparing
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
        }

    }

})


export const {gameOptionUpdate} = gameSlice.actions;
export {fetchGame};
export default gameSlice.reducer;
