import {HubConnection} from "@microsoft/signalr";
import enhancedStore from "../../store/store";
import {fetchSession, updateConnectedPlayers, updateSession} from "../../store/session/reducer";
import {gameOptionUpdate} from '../../store/game/reducer';
import {SessionUpdate} from "../../store/session/types";
import Tile from "../../store/board/types/tile";
import PlayerBoard from "../../store/game/types/playerBoard";
import { updatedTreeTiles } from "../../store/board/reducer";

const {store} = enhancedStore;

export default function connectListeners(connection: HubConnection) {
  console.groupCollapsed("Adding Listeners to Connection")
  console.log(connection);
  console.groupEnd();
  connection.on("UpdateConnectedPlayers", (sessionId: string, connectedPlayers: string[]) => {
    console.groupCollapsed("GameHub: UpdateConnectedPlayers")
    console.log(connectedPlayers);
    console.groupEnd()
    store.dispatch(fetchSession(sessionId));
    store.dispatch(updateConnectedPlayers({
      sessionId,
      connectedPlayers
    }));

  })

  connection.on("HandleSessionUpdate", (sessionUpdate: SessionUpdate) => {
    console.groupCollapsed("GameHub: HandleSessionUpdate")
    console.log(sessionUpdate);
    console.groupEnd()
    if (store.getState().session.id == sessionUpdate.sessionId) {
      store.dispatch(updateSession(sessionUpdate));

      const {tiles} = store.getState().board;
      const {id:playerId} = store.getState().profile.id;
      const {playerBoards} = store.getState().game;

      const boardCode = playerBoards[playerId];
      const treeTiles: number[] = [];
      for(let tile in tiles) {
        if(tiles.hasOwnProperty(tile) && Tile.GetTreeType(tiles[tile]) == PlayerBoard.TreeType(boardCode)) {
          treeTiles.push(parseInt(tile));
        }
      }
      store.dispatch(updatedTreeTiles(treeTiles))
    };
  })

  connection.on("HandleActionFailure", (message: string) => {
    console.error(message);
  })

  connection.on("RefreshSession", (sessionId: string) => {
    if (store.getState().session.id != sessionId) return;
    store.dispatch(fetchSession(sessionId))
  })

  connection.on("UpdateGameOptions", (request: { sessionId: string, gameOption: string, value: boolean }) => {
    if (store.getState().session.id != request.sessionId) return;
    store.dispatch(gameOptionUpdate(request))
  })


}
