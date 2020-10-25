import { combineReducers, CombinedState, AnyAction } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./auth/reducer";
import invitationsReducer, { InvitationsState } from "./invitations/reducer";
import profileReducer, { ProfileState } from "./profile/reducer";
import boardReducer, { BoardState } from "./board/reducer";
import sessionReducer, { SessionState } from "./session/reducer";
import gameReducer, { GameState } from "./game/reducer";
import appStateReducer, { AppState } from "./appState/reducer";
import signalrReducer, { SignalrState } from "./signalR/reducer";
import playerBoardsReducer, { PlayerBoardsState } from "./playerBoard/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  invitations: invitationsReducer,
  profile: profileReducer,
  board: boardReducer,
  game: gameReducer,
  session: sessionReducer,
  appState: appStateReducer,
  signalR: signalrReducer,
  playerBoards: playerBoardsReducer,
});

export type RootReducerState = CombinedState<{
  auth: AuthState;
  invitations: InvitationsState;
  profile: ProfileState;
  board: BoardState;
  game: GameState;
  session: SessionState;
  appState: AppState;
  signalR: SignalrState;
  playerBoards: PlayerBoardsState;
}> | undefined;

export const clearStore = () => (
    {
      type: 'root/ClearStore'
    });

const logoutReducer = (state: RootReducerState, action: AnyAction) => {
  if (action.type = 'root/ClearStore') {
    state = undefined;
  }

  return rootReducer(state, action);
};

export default rootReducer;
