import {HubConnection} from "@microsoft/signalr";
import {setConnectionState} from "../../store/signalR/reducer";
import enhancedStore from "../../store/store";
import {connectToSession} from "../../store/signalR/actions";
const {store} = enhancedStore;

export default function connectListeners(connection:HubConnection){

    connection.onclose(() => {
        store.dispatch(setConnectionState(connection.state));
        console.log(`Onclose -- ${connection.state}`)
    });

    connection.onreconnecting(() => store.dispatch(setConnectionState(connection.state)));

    connection.onreconnected(() => {
        console.log("onReconnected")
        store.dispatch(setConnectionState(connection.state))
        store.dispatch(connectToSession(store.getState().session.id));
    })


}
