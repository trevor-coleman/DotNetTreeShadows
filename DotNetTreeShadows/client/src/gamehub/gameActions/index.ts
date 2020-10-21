import gameHub from "../index"
import enhancedStore from "../../store/store";
import {sentGameAction} from "../../store/signalR/reducer";
import {GameActionType} from "../../store/game/actions";

const {connection} = gameHub;
const {store} = enhancedStore;

async function SendStartGame() {
  await connection.send("StartGame", store.getState().session.id)
  store.dispatch(sentGameAction({type: GameActionType.StartGame}))
}

async function SendPlaceStartingTree(hexCode: number) {
  await connection.send("PlaceStartingTree", store.getState().session.id, hexCode);
  store.dispatch(sentGameAction({type: GameActionType.StartGame}))
}

async function SendPlant(originCode: number, targetCode: number) {
  await connection.send("Plant", store.getState().session.id, originCode, targetCode);
  store.dispatch(sentGameAction({type: GameActionType.Plant}));
}


const gameActions = {
  startGame: SendStartGame,
  placeStartingTree: SendPlaceStartingTree,
  plant: SendPlant,
}

export default gameActions;
