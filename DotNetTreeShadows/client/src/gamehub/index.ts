import * as signalR from '@microsoft/signalr'
import enhancedStore from '../store/store'
import {setConnectionState, setSessionDisconnected} from '../store/signalR/reducer'
import {TreeType} from "../store/board/types/treeType";
import {PieceType} from "../store/board/types/pieceType";
import {gameOptionUpdate} from '../store/game/reducer';
import {HubConnection} from "@microsoft/signalr";
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

connection.on("LogMessage", (message:string)=>{
    console.log(message);
})


const connect = async () => {
    try {
        await connection.start();
        console.log("SignalR Connected.");
        store.dispatch(setConnectionState(connection.state));
        return;
    } catch (err) {
        console.log("connection failed, retrying");
        setTimeout(() => connect(), 5000);
    }
}

const disconnect = async () => {
    try {
        await connection.stop();
        store.dispatch(setConnectionState(connection.state));
        store.dispatch(setSessionDisconnected(true))
    } catch (err) {
        console.error("SignalR disconnect failed: " + err.toString())
    }
}

const send = async (method: GameHubMethod, ...args: any[]) => {
    await connection.send(method.toString(), ...args)
}

const invoke = async (method: GameHubMethod, ...args: any[]) => {
    console.log(args[0]);
    return args.length > 1
        ? await connection.invoke(method.toString(), ...args)
        : args.length == 1
            ? await connection.invoke(method.toString(), args[0])
            : await connection.invoke(method.toString());

    return
}

export default {
    connection,
    connect,
    disconnect,
    send,
    invoke
}

