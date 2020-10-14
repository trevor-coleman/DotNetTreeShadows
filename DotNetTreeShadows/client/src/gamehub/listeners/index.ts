import connectionListeners  from './connection';
import sessionListeners from './session'
import {HubConnection} from "@microsoft/signalr";


export default function applyListeners(connection:HubConnection) {
    connectionListeners(connection);
    sessionListeners(connection);
}
