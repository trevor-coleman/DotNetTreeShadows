import {KnownGameActions} from "./actions";
import {GameState} from "./types";

const initialGameState : GameState = {
    ScoreTokenStacks: {},
    board: {},
    currentTurn: 0,
    firstPlayer: "",
    longGame: false,
    playerBoards: {},
    preventActionsInShadow: false,
    randomizeTurnOrder: false,
    revolution: 0,
    round: 0,
    sunPosition: "NorthWest",
    turnOrder: []
}

export function gameReducer(state= initialGameState, action: KnownGameActions ): GameState {
    switch (action.type){
        case "UPDATE_GAME":
            return {...action.payload};
        case "UPDATE_TILE":
            return {...state}
        case "UPDATE_TILES":
            return {...state}
        case "UPDATE_PLAYER_BOARD":
            return {...state}
        case "UPDATE_GAME_INFO":
            return {...state}
        case "UPDATE_GAME_OPTIONS":
            return {...state}
    }
}
