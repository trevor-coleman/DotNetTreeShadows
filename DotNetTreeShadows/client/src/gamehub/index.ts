import * as signalR from '@microsoft/signalr'
import {HubConnection, HubConnectionState} from '@microsoft/signalr'
import enhancedStore from '../store/store'
import {setConnectionState} from '../store/signalR/reducer'
import {TreeType} from "../store/board/types/treeType";
import {PieceType} from "../store/board/types/pieceType";
import {gameOptionUpdate} from '../store/game/reducer';
import {GameHubMethod} from "./methods";
import connectListeners from "./listeners";


const {store} = enhancedStore;

export type AddPieceToTileRequest = {
  sessionId: string, hexCode: number, treeType: TreeType, pieceType: PieceType
}

const connection: HubConnection = new signalR
  .HubConnectionBuilder()
  .withUrl("/gamehub", {
    accessTokenFactory: () => {
      return store.getState().auth.token
    }
  })
  .withAutomaticReconnect([0, 2000, 2000, 2000, 2000, 2000])
  .configureLogging(signalR.LogLevel.Information)
  .build();

connectListeners(connection);


connection.on("UpdateGameOptions", (request: { sessionId: string, gameOption: string, value: boolean }) => {
  if (store.getState().session.id != request.sessionId) return;
  store.dispatch(gameOptionUpdate(request))
})

connection.on("LogMessage", (message: string) => {
  console.log(message);
})

let tries = 0;
const maxTries = 30;
const tryConnectToSession = async (sessionId: string) => {
  if (connection.state != "Connected") {
    console.log("Attempting to connect");
    connect();
    if(tries < maxTries) {
      setTimeout(() => tryConnectToSession(sessionId), 2000);
      return
    } else {
      console.log(`Connection attempt failed after ${tries} tries`)
    }
  }
  try {
    connection.send("ConnectToSession", sessionId)

  } catch (e) {
    console.log(e.message);
  }
}

const connect = async (retry: boolean = false) => {
  if (connection.state == HubConnectionState.Connected) return;
  try {
    await connection.start()
    store.dispatch(setConnectionState(connection.state));
    tries = 0;
    return;
  } catch (err) {
    console.error(err);
    return;
  }
}

const disconnect = async () => {
  try {
    await connection.stop();
    store.dispatch(setConnectionState(connection.state));
  } catch (err) {
    console.error("SignalR disconnect failed: " + err.toString())
  }
}

const send = async (method: GameHubMethod, ...args: any[]) => {
  await connection.send(method.toString(), ...args)
}

export default {
  connection,
  connect,
  disconnect,
  send,
  tryConnectToSession
}

