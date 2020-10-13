import * as signalR from '@microsoft/signalr'
import enhancedStore from '../store'
import {receiveMessage} from './reducer'
import {TreeType} from "../board/types/treeType";
import {PieceType} from "../board/types/pieceType";
import {addPieceToHex} from '../board/reducer';
import {updateConnectedPlayers} from '../session/reducer';
import {gameOptionUpdate} from '../game/reducer';
import {connectToSession} from "./actions";

const {store} = enhancedStore;

export type AddPieceToTileRequest = {
    sessionId: string, hexCode: number, treeType: TreeType, pieceType: PieceType
}

export const connection = new signalR
    .HubConnectionBuilder()
    .withUrl("/gamehub", { accessTokenFactory: () => {
            console.log("-------------------------------------------")
            console.log( store.getState());
            return store.getState().auth.token
        } })
    .withAutomaticReconnect([0, 2000, 4000, 6000, 8000, 10000, 20000, 30000, 60000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("ClientAddPieceToTile", (request: AddPieceToTileRequest) => {
    store.dispatch(addPieceToHex(request))
});

connection.onclose(() => setTimeout(() => {
    connection.start().catch(err => console.error(err.toString()));
}, 5000))

connection.onreconnected(()=> {
    store.dispatch(connectToSession(store.getState().session.id));
})

connection.on("UpdateConnectedPlayers", (connectedPlayers: string[]) => {
    console.log("UpdateConnectedPlayers", connectedPlayers)
    store.dispatch(updateConnectedPlayers(connectedPlayers));
})

connection.on("MessageReceived", (sender: string, message: string) => {
    store.dispatch(receiveMessage({
        sender,
        message
    }))
})

connection.on("UpdateGameOptions", (request: { sessionId: string, gameOption: string, value: boolean }) => {
    console.log("UPDATE: ", request)
    if (store.getState().session.id != request.sessionId) return;
    store.dispatch(gameOptionUpdate(request))
})


export const connectToSignalR = async () => {
    await connection.start().catch(err => console.error(err.toString()));
}

export const disconnectFromSignalR = async ()=> {
    await connection.stop();
}




export function sendMessage(senderId: string, message: string): void {
    connection.send("newMessage", senderId, message)
}


