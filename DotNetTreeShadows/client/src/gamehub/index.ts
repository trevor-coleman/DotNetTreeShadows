import * as signalR from '@microsoft/signalr'
import {HubConnection} from '@microsoft/signalr'
import enhancedStore from '../store/store'
import {setConnectionState, setConnectedSession} from '../store/signalR/reducer'
import {GameHubMethod} from "./methods";
import applyListeners from "./listeners";

const {store} = enhancedStore;


const connection: HubConnection = new signalR
  .HubConnectionBuilder()
  .withUrl("/gamehub", {
    accessTokenFactory: () => {
      return store.getState().auth.token
    }
  })
  .withAutomaticReconnect([0, 2000, 2000, 2000, 2000, 2000])
  .configureLogging(process.env.NODE_ENV === "development" ? signalR.LogLevel.Information : signalR.LogLevel.Error)
  .build();

applyListeners(connection);




const tryConnectToSession = async (sessionId: string) => {
  if (connection.state != "Connected") {
    try {
      await connect();
      if(store.getState().signalR.connectionState != connection.state) {
        store.dispatch(setConnectionState(connection.state));
      }
      setTimeout(()=>tryConnectToSession(sessionId), 1000);
    } catch (e) {
      setTimeout(() => {
        tryConnectToSession(sessionId)
      }, 2000);
    }
  } else
  try {
    await connection.send("ConnectToSession", sessionId.toString())
    store.dispatch(setConnectedSession(sessionId));
    return
  } catch (e) {
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

