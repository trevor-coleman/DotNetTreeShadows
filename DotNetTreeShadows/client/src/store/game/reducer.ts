import {createSlice} from "@reduxjs/toolkit";
import {SunPosition} from "../../types/game/sunPosition";
import Game from "../../types/game/game";


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
