import connectConnectionListeners  from './connection';
import {HubConnection} from "@microsoft/signalr";

export default function connectListeners(connection:HubConnection) {
    connectConnectionListeners(connection);
}
