import {AApiSection} from "./aApiSection";
import axios, {AxiosResponse} from "axios";
import {Invitation, InvitationStatus} from "../store/invitations/types/invitation";

export default class InvitationApiSection extends AApiSection {
    async getMany(ids:string[]): Promise<AxiosResponse<Invitation[]>> {
        return await axios.get(`invitations`, {params: {ids}}  );
    }

    async get(id:string): Promise<AxiosResponse<Invitation>> {
        return await axios.get(`invitations/${id}`);
    }

    async getAll(): Promise<AxiosResponse<Invitation[]>> {
        console.log("getting all");
        return await axios.get(`invitations`);
    }

    async sendFriendRequest(email: string) {
        const friendRequestRequest = {
            type: "FriendRequest",
            email
        }

        return await axios.post('invitations/friend-request', friendRequestRequest);

    }

    async updateStatus(id: string, invitationStatus: InvitationStatus):Promise<AxiosResponse<Invitation>> {
        return await axios.post(`invitations/${id}/status`, {invitationStatus})
    }


    async sendManySessionInvites(recipientIds: string[], sessionId: string):Promise<AxiosResponse<Invitation[]>> {
        return await axios.post('invitations/session-invites', {
            recipientIds,
            sessionId
        })
    }
}
