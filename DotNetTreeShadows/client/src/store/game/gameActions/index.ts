import enhancedStore from "../../store";
import {GameActionType} from "../actions";
import {doGameAction} from "../../signalR/actions";
import {setActionOrigin} from "../reducer";
import {GameStatus} from "../types/GameStatus";

const {store} = enhancedStore;

export type ActionStage = "selectingAction" | "selectingPiece" | "selectingTiles" | null

export function handleTileClick(hexCode: number) {
    const {turnOrder, currentTurn, status} = store.getState().game
    const {type, stage, origin, target} = store.getState().game.currentAction;
    const {id:sessionId} = store.getState().game.currentAction;
    const {id: playerId} = store.getState().profile;

    if (stage=="selectingAction" || stage == "selectingPiece" || playerId !== turnOrder[currentTurn]) return;

    if(status == GameStatus.PlacingFirstTrees) {
        store.dispatch(doGameAction(
          sessionId, {type: GameActionType.PlaceStartingTree, origin: hexCode}
        ))
    }

    switch (type) {
        case GameActionType.Plant:
            if(origin) {
                store.dispatch(doGameAction(
                    sessionId, {type, origin: hexCode}
                ))
            } else {
                store.dispatch(setActionOrigin(hexCode))
            }
            break;
        case GameActionType.Grow:
        case GameActionType.PlaceStartingTree:
        case GameActionType.Collect:
            if(stage == "selectingOrigin") {
                store.dispatch(doGameAction(
                    sessionId, {type, origin: hexCode}
                    ))
            }
            break;
        case GameActionType.Buy:
        case GameActionType.EndTurn:
        case GameActionType.StartGame:
        case GameActionType.UndoAction:
        case GameActionType.Kick:
        case GameActionType.Resign:
        default:
            break;

    }

}
