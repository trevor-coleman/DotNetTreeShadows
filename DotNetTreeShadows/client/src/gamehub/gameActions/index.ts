import gameHub from "../index"
import enhancedStore from "../../store/store";
import {sentGameAction} from "../../store/signalR/reducer";
import {GameActionType} from "../../store/game/actions";
import {setActionOrigin, clearCurrentAction} from "../../store/game/reducer";
import {PieceType} from "../../store/board/types/pieceType";

const {connection} = gameHub;
const {store} = enhancedStore;
const sessionId = ()=>store.getState().session.id;

async function SendStartGame() {
  await connection.send("StartGame", sessionId())
  store.dispatch(sentGameAction({type: GameActionType.StartGame}))
}

async function SendPlaceStartingTree(hexCode: number) {
  await connection.send("PlaceStartingTree", sessionId(), hexCode);
  store.dispatch(sentGameAction({type: GameActionType.StartGame}))
}

async function SendPlant(originCode: number, targetCode: number) {
  await connection.send("Plant", sessionId(), originCode, targetCode);
  store.dispatch(sentGameAction({type: GameActionType.Plant}));
  store.dispatch(clearCurrentAction());
}

async function SendBuy(pieceType: PieceType) {
  await connection.send("Buy", sessionId(), pieceType)
  store.dispatch(sentGameAction({type: GameActionType.Buy}))
}
async function SendEndTurn() {
  await connection.send("EndTurn", sessionId())
  store.dispatch(sentGameAction({type:GameActionType.EndTurn}));
}

async function SendGrow (originCode:number) {
  await connection.send("Grow", sessionId(), originCode);
  store.dispatch(sentGameAction({type:GameActionType.Grow}));
  store.dispatch(clearCurrentAction());
}

const gameActions = {
  startGame: SendStartGame,
  placeStartingTree: SendPlaceStartingTree,
  plant: SendPlant,
  buy: SendBuy,
  endTurn: SendEndTurn,
  grow: SendGrow,
}

export default gameActions;
