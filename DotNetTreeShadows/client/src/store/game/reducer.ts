import {createSlice} from "@reduxjs/toolkit";
import {SunPosition} from "./sunPosition";
import Game from "./game";


export interface GameState extends Game {}

const initialGameState: GameState = {
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
    extraReducers: undefined,
    initialState: initialGameState,
    reducers: {

    }

})
