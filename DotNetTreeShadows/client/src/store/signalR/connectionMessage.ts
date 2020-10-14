import {HubConnectionState} from "@microsoft/signalr";

export enum ConnectionMessage {
  ConnectingToServer,
  AttemptingToReconnect,
  ConnectionLost
}

export function getConnectionMessage(currentState:HubConnectionState, nextState: HubConnectionState):ConnectionMessage|null {
  if(currentState == HubConnectionState.Disconnected  && nextState == HubConnectionState.Connecting) {
    return ConnectionMessage.ConnectingToServer;
  }

  if(currentState == HubConnectionState.Reconnecting && nextState == HubConnectionState.Disconnected) {
    return ConnectionMessage.ConnectionLost;
  }

  if(nextState == HubConnectionState.Connected) {
    return null;
  }
  if(nextState == HubConnectionState.Reconnecting) {
    return ConnectionMessage.AttemptingToReconnect;
  }

  return ConnectionMessage.ConnectingToServer;
}
