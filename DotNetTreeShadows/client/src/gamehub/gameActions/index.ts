import startGameAction from './startGameAction';

const gameActions = {
  startGame: SendStartGame,
  placeFirstTree: placeFirstTreeAction,
}

import gameHub from "../index"
import enhancedStore from "../../store/store";


const {connection} = gameHub;
const {store} = enhancedStore;

async function SendStartGame() {
  await connection.send("StartGame", store.GetState().session.id)
}
async function SendPlaceFirstPiece() {
  await connection.send("PlaceStartingTree", store.GetState().session.id);
}
