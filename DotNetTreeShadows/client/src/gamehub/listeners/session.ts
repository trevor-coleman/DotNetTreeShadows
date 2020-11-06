import {HubConnection} from "@microsoft/signalr";
import enhancedStore from "../../store/store";
import {
  fetchSession,
  updateConnectedPlayers,
  updateSession,
  updateLinkEnabled
} from "../../store/session/reducer";
import {gameOptionUpdate} from '../../store/game/reducer';
import {SessionUpdate} from "../../store/session/types";
import Tile from "../../store/board/types/tile";
import PlayerBoard from "../../store/game/types/playerBoard";
import { updatedTreeTiles } from "../../store/board/reducer";
import {TreeType} from "../../store/board/types/treeType";
import {updateTreeTiles} from "../../store/board/thunks";
import { updateFocus } from '../../store/game/thunks';
import { GameOption } from '../../store/game/types/GameOption';

const {store} = enhancedStore;

export default function connectListeners(connection: HubConnection) {
  console.groupCollapsed("Adding Listeners to Connection")
  console.log(connection);
  console.groupEnd();
  connection.on("UpdateConnectedPlayers", (sessionId: string, connectedPlayers: string[]) => {
    console.groupCollapsed("GameHub: UpdateConnectedPlayers")
    console.log(connectedPlayers);
    console.groupEnd()
    store.dispatch(updateConnectedPlayers({
      sessionId,
      connectedPlayers
    }));

  })

  connection.on("HandleSessionUpdate", (sessionUpdate: SessionUpdate) => {
    console.groupCollapsed("GameHub: HandleSessionUpdate")
    console.log(sessionUpdate);
    console.groupEnd()
    if (!store.getState().session.id || store.getState().session.id == sessionUpdate.sessionId) {
      store.dispatch(updateSession(sessionUpdate));
      store.dispatch(updateTreeTiles());
      store.dispatch(updateFocus());
    };
  })

  connection.on("UpdateLinkEnabled", (sessionId: string, value: boolean)=> {
    store.dispatch(
      updateLinkEnabled({
        sessionId,
        value
      })
    );
  })

  connection.on("HandleActionFailure", (message: string) => {
    console.error(message);
  })

  connection.on("RefreshSession", (sessionId: string) => {
    if (store.getState().session.id != sessionId) return;
    store.dispatch(fetchSession(sessionId))
  })

  connection.on("UpdateGameOptions", (request: { sessionId: string, gameOption: GameOption, value: boolean }) => {
    if (store.getState().session.id != request.sessionId) return;
    store.dispatch(gameOptionUpdate(request))
  })


}
