import {AApiSection} from "./aApiSection";
import axios, {AxiosResponse} from "axios";
import {FriendProfile} from "../store/profile/types/friendProfile";
import {SessionSummary} from "../store/profile/reducer";
import {Profile} from '../store/profile/types/profile'

export default class ProfileApiSection extends AApiSection {

    async get() {
        return await axios.get('profiles/me');
    }

    async getFriends(): Promise<AxiosResponse<FriendProfile[]>> {
        return await axios.get('profiles/me/friends');
    }

    async getSessionSummaries(): Promise<AxiosResponse<SessionSummary[]>> {
        return await axios.get('profiles/me/sessions');
    }

    async removeFriend(id: string) {
        return await axios.delete(`profiles/me/friends/${id}`);
    }



    async updateProfile( changeRequest:{[key:string]: string
}):Promise<AxiosResponse<Profile>> {
        return await axios.put(`profiles/me`, changeRequest);
    }
}
