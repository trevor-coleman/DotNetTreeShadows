import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";
import {Invitation} from "./invitation";

export const fetchInvitations = createAsyncThunk(
    'invitations/fetchInvitations',
    async ():Promise<{ friendRequests:Invitation[], sessionInvites: Invitation[] }> =>{
        const response = await api.invitations.getAll();
        const friendRequests = [];
        const sessionInvites = [];
        for (let i=0;i<response.data.length;i++) {
            const invitation =response.data[i];
            switch(invitation.invitationType) {
                case "FriendRequest":
                    friendRequests.push(invitation);
                    break;
                case "SessionInvite":
                    sessionInvites.push(invitation);
            }
        };
        return {friendRequests, sessionInvites}
    })

export const sendFriendRequest = createAsyncThunk(
    'inviations/sendFriendRequest',
    async (email:string) =>{
        const response = await api.invitations.sendFriendRequest(email);
        return response;
    }
)
