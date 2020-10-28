import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FriendProfile } from "../profile/types/friendProfile";
import { Action } from "typesafe-actions";
import { removeFriendFromProfile } from "../profile/actions";
import { RequestState } from "../../api/requestState";
import { inviteFriendsToSession } from "./addPlayerDialog/actions";
import { Session, SessionUpdate } from "../session/types";
import { fetchSessionFromApi, joinSession } from "../session/actions";
import { updateSession } from "../session/reducer";
import { signOut } from "../auth/reducer";
import { useTypedSelector } from "../index";
import { PieceType } from "../board/types/pieceType";

interface RejectedAction<ThunkArg> {
  type: string
  payload: any
  error: any
  meta: {
    requestId: string
    arg: ThunkArg
    aborted: boolean
    condition: boolean
  }
}

export interface AppState {
  friendList: {
    showRemoveFriendConfirmDialog: boolean; friendToRemove: FriendProfile | null;
  };
  addPlayerDialog: {
    lastSession: string | null; open: boolean; requestState: RequestState; lastRequest: string | null; message: string | null; checked: string[];
  };
  discardAlertDialog: { open: boolean; pieceType: PieceType | null };
  join: {
    requestState: RequestState; requestSession: string | null; failureMessage: string | null;
  };
  otherPlayerPopover: {
    open: boolean;
  },
  rulesDialog: {
    open: boolean;
  }
}

const initialAppState: AppState = {
  friendList: {
    showRemoveFriendConfirmDialog: false,
    friendToRemove: null,
  },
  addPlayerDialog: {
    lastSession: null,
    open: false,
    requestState: RequestState.Idle,
    message: null,
    lastRequest: null,
    checked: [],
  },
  discardAlertDialog: {
    open: false,
    pieceType: PieceType.SmallTree,
  },
  join: {
    requestState: RequestState.Idle,
    requestSession: null,
    failureMessage: "",
  },
  otherPlayerPopover: {
    open: false,
  },
  rulesDialog: {
    open: false,
  },
};

const appStateSlice = createSlice({
  name: "game",
  extraReducers: builder => {
    builder.addCase(joinSession.pending, (state, action) => {
      console.log("PENDING:", action.meta.arg);
      return (
          {
            ...state,
            join: {
              ...state.join,
              requestState: RequestState.Pending,
              requestSession: action.meta.arg,
              failureMessage: null,
            },
          });
    });
    builder.addCase(joinSession.fulfilled, (state, action) => {
      if (action.meta.arg !== state.join.requestSession) return state;
      return {
        ...state,
        join: {
          ...state.join,
          requestState: RequestState.Fulfilled,
        },
      };
    });
    builder.addCase(joinSession.rejected, (state, action) => {
      if (action.meta.arg !== state.join.requestSession) return state;
      console.log(action.payload);
      return {
        ...state,
        join: {
          ...state.join,
          requestState: RequestState.Rejected,
          requestSession: null,
          failureMessage: "Failed",
        },
      };
    });
    builder.addCase(removeFriendFromProfile.fulfilled,
        (state: AppState, action: Action) => (
            {
              ...state,
              friendList: {
                ...state.friendList,
                showRemoveFriendConfirmDialog: false,
              },
            }));
    builder.addCase(fetchSessionFromApi.fulfilled,
        (state: AppState, action: PayloadAction<Session>) => {
          const {id: sessionId} = action.payload;
          if (sessionId == state.addPlayerDialog.lastSession) return state;

          return {
            ...state,
            addPlayerDialog: {
              ...initialAppState.addPlayerDialog,
              lastSession: sessionId,
            },
          };
        });
    builder.addCase(updateSession,
        (state: AppState, action: PayloadAction<SessionUpdate>) => {
          const {sessionId} = action.payload;

          const join = sessionId === state.join.requestSession
                       ? {...initialAppState.join}
                       : state.join;

          const addPlayerDialog = sessionId == state.addPlayerDialog.lastSession
                                  ? state.addPlayerDialog
                                  : {
                ...initialAppState.addPlayerDialog,
                lastSession: sessionId,
              };

          return {
            ...state,
            join,
            addPlayerDialog,
          };
        });
    builder.addCase(signOut, state => initialAppState);
  },

  initialState: initialAppState,
  reducers: {
    showRemoveFriendConfirmDialog: (state, action: PayloadAction<boolean>) => (
        {
          ...state,
          friendList: {
            ...state.friendList,
            showRemoveFriendConfirmDialog: action.payload,
          },
        }),
    showOtherPlayerPopover: (state, action: PayloadAction<boolean>) => (
        {
          ...state,
          otherPlayerPopover: {
            ...state.otherPlayerPopover,
            open: action.payload,
          },
        }),
    showRulesDialog: (state, action: PayloadAction<boolean>) => (
        {
          ...state,
          rulesDialog: {
            ...state.rulesDialog,
            open: action.payload,
          },
        }),
    setFriendToRemove: (state, action: PayloadAction<FriendProfile>) => (
        {
          ...state,
          friendList: {
            ...state.friendList,
            friendToRemove: action.payload,
          },
        }),
    showAddPlayerDialog: (state, action: PayloadAction<boolean>) => (
        {
          ...state,
          addPlayerDialog: {
            ...state.addPlayerDialog,
            open: action.payload,
          },
        }),
    showDiscardAlertDialog: (state,
                             action: PayloadAction<{ open: boolean; pieceType?: PieceType | null }>) => {
      const {open, pieceType} = action.payload;
      return {
        ...state,
        discardAlertDialog: {
          ...state.discardAlertDialog,
          open: open,
          pieceType: pieceType ?? state.discardAlertDialog.pieceType,
        },
      };
    },

    setAddPlayerDialogChecked: (state: AppState,
                                action: PayloadAction<string[]>) => (
        {
          ...state,
          addPlayerDialog: {
            ...state.addPlayerDialog,
            checked: action.payload,
          },
        }),

    setInviteFriendsToSessionState: (state: AppState, action: PayloadAction<{
      requestState: RequestState; message: string | null;
    }>) => {
      const {requestState, message} = action.payload;
      const open: boolean = requestState == RequestState.Pending ||
                            requestState == RequestState.Rejected;
      return {
        ...state,
        addPlayerDialog: {
          ...state.addPlayerDialog,
          open: open,
          requestState,
          message,
        },
      };
    },
    clearAddPlayerDialogCheckForPlayers: (state: AppState,
                                          action: PayloadAction<string[]>) => {
      const checked = state.addPlayerDialog.checked.filter(id => action.payload.indexOf(
          id) == -1);
      return {
        ...state,
        addPlayerDialog: {
          ...state.addPlayerDialog,
          checked,
        },
      };
    },
  },
});

export const useDiscardAlertDialog = () => useTypedSelector(state => state.appState.discardAlertDialog);
export const useJoin = () => useTypedSelector(state => state.appState.join);
export const {
  showRemoveFriendConfirmDialog, setFriendToRemove, showAddPlayerDialog, showOtherPlayerPopover, showRulesDialog,
  setInviteFriendsToSessionState, setAddPlayerDialogChecked, clearAddPlayerDialogCheckForPlayers, showDiscardAlertDialog,
} = appStateSlice.actions;
export { inviteFriendsToSession };
export default appStateSlice.reducer;
