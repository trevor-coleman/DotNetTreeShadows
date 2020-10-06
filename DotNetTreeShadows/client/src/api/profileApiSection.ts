import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import {FriendProfile} from "../store/profile/friendProfile";
import {SessionSummary} from "../store/profile/reducer";

export default class ProfileApiSection extends AApiSection {
    public constructor(instance: AxiosInstance) {
        super(instance);
    }

    async get() {
        return await this.instance.get('profiles/me');
    }

    async getFriends():Promise<AxiosResponse<FriendProfile[]>> {
        return await this.instance.get('profiles/me/friends');
    }

    async getSessionSummaries():Promise<AxiosResponse<SessionSummary[]>> {
        return await this.instance.get('profiles/me/sessions');
    }
}
