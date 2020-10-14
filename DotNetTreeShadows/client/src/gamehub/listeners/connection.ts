import {HubConnection} from "@microsoft/signalr";
import {setConnectionState} from "../../store/signalR/reducer";
import enhancedStore from "../../store/store";
import {connectToSession} from "../../store/signalR/actions";
const {store} = enhancedStore;

export default function connectListeners(connection:HubConnection){

    connection.onclose(() => setTimeout(() => {
        store.dispatch(setConnectionState(connection.state))
        connection.start().catch(err => console.error(err.toString()));
    }, 5000))

    connection.onreconnecting(() => store.dispatch(setConnectionState(connection.state)));

    connection.onreconnected(() => {
        store.dispatch(setConnectionState(connection.state))
        store.dispatch(connectToSession(store.getState().session.id));
    })


}
