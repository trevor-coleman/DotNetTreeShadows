import {AppDispatch} from "../index";
import {setInviteFriendsToSessionState, clearAddPlayerDialogCheckForPlayers} from "./reducer";
import {RequestState} from "../../api/requestState";
import {fetchSession} from "../session/thunks";
import {fetchProfile} from "../profile/actions";
import {sendManySessionInvite} from "../invitations/actions";


export const inviteFriendsToSession = (friendIds: string[], sessionId:string)=> async (dispatch:AppDispatch)=> {
    console.log("here we go");
    dispatch(setInviteFriendsToSessionState({
        requestState: RequestState.Pending,
        message: null,
    }))
    try{
        await dispatch(sendManySessionInvite({friendIds, sessionId}));
        await dispatch( clearAddPlayerDialogCheckForPlayers(friendIds))
        await dispatch (fetchSession(sessionId));
        await dispatch (fetchProfile());
        dispatch(setInviteFriendsToSessionState({
            requestState: RequestState.Fulfilled,
            message: null,
        }))
    } catch (e) {
        dispatch(setInviteFriendsToSessionState({
            requestState: RequestState.Rejected,
            message: e.response.data
        }))
    }
}
