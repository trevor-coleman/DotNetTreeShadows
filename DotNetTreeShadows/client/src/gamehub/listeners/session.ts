import {HubConnection} from "@microsoft/signalr";
import enhancedStore from "../../store/store";
import {fetchSession, updateConnectedPlayers, updateSession} from "../../store/session/reducer";
import { gameOptionUpdate } from '../../store/game/reducer';
import {Session, SessionUpdate} from "../../store/session/types";
import Game from "../../store/game/types/game";
import {Board} from "../../store/board/types/board";

const {store} = enhancedStore;

export default function connectListeners(connection:HubConnection) {

    console.log(connection)
    connection.on("UpdateConnectedPlayers", (sessionId:string,connectedPlayers: string[]) => {
        console.log("ConnectedPlayers");
        console.log(sessionId, connectedPlayers)
        store.dispatch(fetchSession(sessionId));
        store.dispatch(updateConnectedPlayers({sessionId, connectedPlayers}));

    })

    connection.on("HandleActionResult", (sessionUpdate: SessionUpdate)=>{
      console.log("actionResult", sessionUpdate)
      if(store.getState().session.id == sessionUpdate.sessionId) store.dispatch(updateSession(sessionUpdate));
    })

    connection.on("HandleActionFailure", (message:string)=>{
        console.log(message);
    })

  connection.on("UpdateGameOptions", (request: { sessionId: string, gameOption: string, value: boolean }) => {
    if (store.getState().session.id != request.sessionId) return;
    store.dispatch(gameOptionUpdate(request))
  })


}
