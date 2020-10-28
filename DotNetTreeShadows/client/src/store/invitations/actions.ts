import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch} from '../index'
import {Invitation, InvitationStatus} from "./types/invitation";
import {ExtraInfo} from "../extraInfo";

type InvitationsResponse = { friendRequests: Invitation[], sessionInvites: Invitation[] }


export const sendManySessionInvites = createAsyncThunk<Invitation[], { friendIds: string[], sessionId: string }, ExtraInfo>(
    'invitations/sendManySessionInvites',
    async ({friendIds, sessionId}, {extra}) => {
        const {api} = extra;
        try {
            const response = await api.invitations.sendManySessionInvites(friendIds, sessionId);
            return response.data;
        } catch (e) {
            console.error(e.response.data);
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
      console.groupCollapsed("fetchInvitations")
      console.log(response.data);
      console.groupEnd()
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
                    break;
            }
        }
        ;
        return {
            friendRequests,
            sessionInvites
        }
    })


export const sendFriendRequest = createAsyncThunk<void, string, ExtraInfo>(
    'invitations/sendFriendRequest',
    async (recipient, thunkAPI) => {
        const {api} = thunkAPI.extra;
        try {
            const response = await api.invitations.sendFriendRequest(recipient);
            if(response.status != 200) return thunkAPI.rejectWithValue(JSON.parse(
                response.request.response).message as string)
            return;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)


export const updateInvitationStatus = createAsyncThunk<Invitation, { invitation: Invitation, status: InvitationStatus }, ExtraInfo>(
    'invitations/updateInvitationStatus',
    async ({invitation, status}, {extra}) => {
        const {api} = extra;
        const {id} = invitation;
        try {
            const response = await api.invitations.updateStatus(id, status);
            return response.data;
        } catch (e) {
            console.log(e.response)
            return e.response;
        }
    }
)

