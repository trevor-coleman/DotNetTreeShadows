import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from '../index'
import {Invitation, InvitationStatus} from "./types/invitation";
import {ExtraInfo} from "../store";
import {fetchProfile} from "../profile/reducer";

type InvitationsResponse = { friendRequests: Invitation[], sessionInvites: Invitation[] }


export const sendManySessionInvite = createAsyncThunk<string[], {friendIds: string[], sessionId: string}, ExtraInfo>(
    'invitations/sendSessionInvite',
    async ({friendIds, sessionId}, {extra})=>{
        const{api}= extra;
        try{
            await api.invitations.sendManySessionInvites(friendIds, sessionId);
            return friendIds
        } catch (e) {
            console.log(e.response.data);
            return []
        }
    }
);



export const fetchInvitations = createAsyncThunk<InvitationsResponse, void, ExtraInfo>(
    'invitations/fetchInvitations',
    async (_, {extra}): Promise<InvitationsResponse> => {
        const {api} = extra;
        const response = await api.invitations.getAll();
        const friendRequests = [];
        const sessionInvites = [];
        console.log("Fetching invitations: ", response);
        for (let i = 0; i < response.data.length; i++) {
            const invitation = response.data[i];
            switch (invitation.invitationType) {
                case "FriendRequest":
                    friendRequests.push(invitation);
                    break;
                case "SessionInvite":
                    sessionInvites.push(invitation);
                    break;
                default:
                    console.error("AHA!", invitation)
            }
        }
        ;
        return {
            friendRequests,
            sessionInvites
        }
    })


export const addFriend = (email: string) => async (dispatch: AppDispatch) => {
    await dispatch(sendFriendRequest(email));
    await dispatch(fetchProfile());
    await dispatch(fetchInvitations());
};


export const sendFriendRequest = createAsyncThunk<void, string, ExtraInfo>(
    'invitations/sendFriendRequest',
    async (email, {extra}) => {
        const {api} = extra;
        try {
            const response = await api.invitations.sendFriendRequest(email);
            return;
        } catch (e) {
            console.log(e.response.data)
            return;
        }
    }
)




export const updateInvitation = (id: string, status: InvitationStatus) => async (dispatch: AppDispatch) => {
    await dispatch(updateInvitationStatus({
        id,
        status
    }));
    await dispatch(fetchProfile())
    await dispatch(fetchInvitations())
};


export const updateInvitationStatus = createAsyncThunk<void, { id: string, status: InvitationStatus }, ExtraInfo>(
    'invitations/updateInvitationStatus',
    async ({id, status}, {extra}) => {

        const {api} = extra;
        console.log("sending");
        try {
            const response = await api.invitations.updateStatus(id, status);
            console.log(response);
            return;
        } catch (e) {
            console.log(e.response.data)
        }
    }
)

