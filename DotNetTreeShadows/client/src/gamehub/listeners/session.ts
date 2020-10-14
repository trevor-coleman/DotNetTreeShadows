import {HubConnection} from "@microsoft/signalr";
import enhancedStore from "../../store/store";
import {updateConnectedPlayers} from "../../store/session/reducer";

const {store} = enhancedStore;

export default function connectListeners(connection:HubConnection) {

    connection.on("UpdateConnectedPlayers", (sessionId:string,connectedPlayers: string[]) => {
        store.dispatch(updateConnectedPlayers({sessionId, connectedPlayers}));
    })

    connection.on("HandleActionResult", (action:any)=>{
        console.log(action);
    })

    connection.on("HandleActionFailure", (...args:any[])=>{
        console.log(args);
    })

}
