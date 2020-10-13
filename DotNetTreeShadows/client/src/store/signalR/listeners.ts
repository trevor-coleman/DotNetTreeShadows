import * as signalR from '@microsoft/signalr'
import enhancedStore from '../store'
import {receiveMessage} from './reducer'
import {TreeType} from "../board/types/treeType";
import {PieceType} from "../board/types/pieceType";
import {addPieceToHex} from '../board/reducer';
import {updateConnectedPlayers} from '../session/reducer';

const {store} = enhancedStore;

export const connection = new signalR.HubConnectionBuilder().withUrl("/gamehub").build();

export type AddPieceToTileRequest = {
    sessionId: string, hexCode: number, treeType: TreeType, pieceType: PieceType
}

connection.on("ClientAddPieceToTile", (request: AddPieceToTileRequest) => {
    store.dispatch(addPieceToHex(request))
})

connection.onclose(() => setTimeout(() => {
    connection.start().catch(err => console.error(err.toString()));
}, 5000))

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

connection.start().catch(err => console.error(err.toString()));

export function sendMessage(senderId: string, message: string): void {
    connection.send("newMessage", senderId, message)
}


