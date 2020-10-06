import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import {FriendProfile} from "../types/profile/friendProfile";

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
}
