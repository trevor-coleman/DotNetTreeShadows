import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import {Invitation} from "../store/invitations/invitation";

export default class InvitationApiSection extends AApiSection {
    public constructor(instance: AxiosInstance) {
        super(instance);
    }

    async getMany(ids:string[]): Promise<AxiosResponse<Invitation[]>> {
        return await this.instance.get(`invitations`, {params: {ids}}  );
    }

    async get(id:string): Promise<AxiosResponse<Invitation>> {
        return await this.instance.get(`invitations/${id}`);
    }

    async getAll(): Promise<AxiosResponse<Invitation[]>> {
        return await this.instance.get(`invitations`);
    }

    async sendFriendRequest(email: string) {
        const friendRequestRequest = {
            type: "FriendRequest",
            email
        }

        return await this.instance.post('invitations', friendRequestRequest);

    }
}
