import enhancedStore from "../../store";
import {GameActionType} from "../actions";
import {setActionOrigin} from "../reducer";
import {GameStatus} from "../types/GameStatus";
import actionFactory from '../../../gamehub/gameActions/ActionFactory';
import gameActions from "../../../gamehub/gameActions";

const {store} = enhancedStore;

export type ActionStage = "selectingAction" | "selectingPiece" | "selectingTiles" | null

export async function handleTileClick(hexCode: number) {
    const {turnOrder, currentTurn, status} = store.getState().game
    const {type, stage, origin, target} = store.getState().game.currentAction;
    const {id: sessionId} = store.getState().session;
    const {id: playerId} = store.getState().profile;

    console.log(sessionId);

    if (stage == "selectingAction" || stage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

    if (status == GameStatus.PlacingFirstTrees) {
        await gameActions.placeFirstTree(hexCode);
    }

    switch (type) {
        case GameActionType.Plant:
        case GameActionType.Grow:
        case GameActionType.PlaceStartingTree:
        case GameActionType.Buy:
        case GameActionType.EndTurn:
        case GameActionType.StartGame:
        case GameActionType.UndoAction:
        case GameActionType.Kick:
        case GameActionType.Resign:
        case GameActionType.Collect:
        default:
            console.log('not implemented')
            break;

    }

}
