import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FriendProfile} from "../profile/types/friendProfile";
import {Action} from "typesafe-actions";
import {removeFriendFromProfile} from "../profile/actions";
import {RequestState} from "../../api/requestState";
import {inviteFriendsToSession} from "./addPlayerDialog/actions";
import {Session, SessionUpdate} from "../session/types";
import {fetchSessionFromApi} from "../session/actions";
import {updateSession} from '../session/reducer'
import Game from "../game/types/game";
import {Board} from "../board/types/board";
import {signOut} from "../auth/reducer";

export interface AppState {
    friendList: {
        showRemoveFriendConfirmDialog: boolean,
        friendToRemove: FriendProfile | null,
    },
    addPlayerDialog: {
        lastSession: string|null,
        open: boolean,
        requestState: RequestState,
        lastRequest: string | null,
        message: string | null,
        checked: string[],
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
    }
}

const appStateSlice = createSlice({
    name: 'game',
    extraReducers: builder => {
        builder.addCase(removeFriendFromProfile.fulfilled, (state: AppState, action: Action) => ({
            ...state,
            friendList: {
                ...state.friendList,
                showRemoveFriendConfirmDialog: false,
            }
        }));
        builder.addCase(fetchSessionFromApi.fulfilled, (state: AppState, action: PayloadAction<Session>) => {
            const {id: sessionId} = action.payload;
            if (sessionId == state.addPlayerDialog.lastSession) return state;

            return {
                ...state,
                addPlayerDialog: {
                    ...initialAppState.addPlayerDialog,
                    lastSession: sessionId
                },
            }
        })
        builder.addCase(updateSession, (state: AppState, action: PayloadAction<SessionUpdate>) => {
            const {sessionId} = action.payload;
            if (sessionId == state.addPlayerDialog.lastSession) return state;

            return  {
                ...state,
                addPlayerDialog: {
                    ...initialAppState.addPlayerDialog,
                    lastSession: sessionId
                },

            }
        })
        builder.addCase(signOut, (state) => initialAppState);
    }
    ,


    initialState: initialAppState,
    reducers: {
        showRemoveFriendConfirmDialog: (state, action: PayloadAction<boolean>) => ({
            ...state,
            friendList: {
                ...state.friendList,
                showRemoveFriendConfirmDialog: action.payload
            }
        }),
        setFriendToRemove: (state, action: PayloadAction<FriendProfile>) => ({
            ...state,
            friendList: {
                ...state.friendList,
                friendToRemove: action.payload,
            }
        }),
        showAddPlayerDialog: (state, action: PayloadAction<boolean>) => ({
            ...state,
            addPlayerDialog: {
                ...state.addPlayerDialog,
                open: action.payload
            }
        }),

        setAddPlayerDialogChecked: (state: AppState, action: PayloadAction<string[]>) => ({
            ...state,
            addPlayerDialog: {
                ...state.addPlayerDialog,
                checked: action.payload,
            }

        }),

        setInviteFriendsToSessionState: (state: AppState, action: PayloadAction<{ requestState: RequestState, message: string | null }>) => {
            const {requestState, message} = action.payload;
            const open: boolean = requestState == RequestState.Pending || requestState == RequestState.Rejected;
            return ({
                ...state,
                addPlayerDialog: {
                    ...state.addPlayerDialog,
                    open: open,
                    requestState,
                    message,
                }

            })
        },
        clearAddPlayerDialogCheckForPlayers: (state:AppState, action:PayloadAction<string[]>)=> {
            const checked = state.addPlayerDialog.checked.filter(id=>action.payload.indexOf(id) == -1);
            return {
                ...state,
                addPlayerDialog: {
                    ...state.addPlayerDialog,
                    checked
                }
            }
        }

    }
})


export const {showRemoveFriendConfirmDialog, setFriendToRemove, showAddPlayerDialog, setInviteFriendsToSessionState, setAddPlayerDialogChecked, clearAddPlayerDialogCheckForPlayers} = appStateSlice.actions;
export {inviteFriendsToSession};
export default appStateSlice.reducer;
