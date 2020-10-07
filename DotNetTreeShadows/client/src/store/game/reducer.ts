import {createSlice} from "@reduxjs/toolkit";
import {SunPosition} from "./sunPosition";
import Game from "./game";
import {fetchGame} from "./actions";
import {RequestState} from "../../api/requestState";


export interface GameState extends Game {
    loadingGameStatus : RequestState,
}

const initialGameState: GameState = {
    loadingGameStatus: RequestState.Idle,
    board: {},
    currentTurn: 0,
    firstPlayer: "",
    gameOptions: {},
    playerBoards: {},
    revolution: 0,
    sunPosition: SunPosition.NorthWest,
    scores: {},
    scoringTokens: {},
    turnOrder: []
}

const gameSlice = createSlice({
    name: 'game',
    extraReducers: builder => {
        builder.addCase(fetchGame.pending, (state) => ({
            ...state,
            loadingGameStatus: RequestState.Pending
        }));

        builder.addCase(fetchGame.rejected, (state, action) => ({
            ...state,
            loadingGameStatus: RequestState.Rejected
        }));

        builder.addCase(fetchGame.fulfilled, (state, action) =>
            ({
                ...state,
                ...action.payload,
                loadingGameStatus: RequestState.Fulfilled,

            }));
    },
    initialState: initialGameState,
    reducers: {

    }

})


export const {} = gameSlice.actions;
export {fetchGame};
export default gameSlice.reducer;
