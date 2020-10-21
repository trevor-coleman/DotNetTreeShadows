import * as signalR from '@microsoft/signalr'
import {HubConnection, HubConnectionState} from '@microsoft/signalr'
import enhancedStore from '../store/store'
import {setConnectionState, setConnectedSession} from '../store/signalR/reducer'
import {TreeType} from "../store/board/types/treeType";
import {PieceType} from "../store/board/types/pieceType";
import {gameOptionUpdate} from '../store/game/reducer';
import {GameHubMethod} from "./methods";
import applyListeners from "./listeners";

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

applyListeners(connection);




const tryConnectToSession = async (sessionId: string) => {
  console.groupCollapsed(`Connecting to Session ${sessionId}`)
  if (connection.state != "Connected") {
    console.log("Hub is not connected")
    try {
      await connect();
      if(store.getState().signalR.connectionState != connection.state) {
        store.dispatch(setConnectionState(connection.state));
      }
      console.groupEnd();
      tryConnectToSession(sessionId);
    } catch (e) {
      setTimeout(() => {
        console.groupEnd();
        tryConnectToSession(sessionId)
      }, 2000);
    }
  } else
  try {
    console.log("Hub is connected -- connecting to session", sessionId)
    await connection.send("ConnectToSession", sessionId.toString())
    store.dispatch(setConnectedSession(sessionId));
    console.groupEnd();
    return
  } catch (e) {
    console.error(e)
    console.groupEnd();
    setTimeout(() => connection.send("ConnectToSession", sessionId), 2000)
  }
}

const connect = async (retry: boolean = false) => {
  try {
    await connection.start()
    store.dispatch(setConnectionState(connection.state));
    return;
  } catch (err) {
    store.dispatch(setConnectionState(connection.state));
    console.error(err);
    return;
  }
}

const disconnect = async () => {
  try {
    console.log("Diconnecting!")
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

