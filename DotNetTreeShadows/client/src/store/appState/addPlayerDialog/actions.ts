import {AppDispatch} from "../../index";
import {setInviteFriendsToSessionState, clearAddPlayerDialogCheckForPlayers} from "../reducer";
import {RequestState} from "../../../api/requestState";
import {sendManySessionInvites} from "../../invitations/actions";


export const inviteFriendsToSession = (friendIds: string[], sessionId:string)=> async (dispatch:AppDispatch)=> {
    dispatch(setInviteFriendsToSessionState({
        requestState: RequestState.Pending,
        message: null,
    }))
    try{
        await dispatch(sendManySessionInvites({friendIds, sessionId}));
        await dispatch( clearAddPlayerDialogCheckForPlayers(friendIds))
        dispatch(setInviteFriendsToSessionState({
            requestState: RequestState.Fulfilled,
            message: null,
        }))
    } catch (e) {
        dispatch(setInviteFriendsToSessionState({
            requestState: RequestState.Rejected,
            message: e?.message ?? "setInviteFriendsToSessionState failed."
        }))
    }
}
