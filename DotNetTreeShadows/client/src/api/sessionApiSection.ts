import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import {Session} from '../store/session/session'

export default class SessionApiSection extends AApiSection {

    public constructor(instance:AxiosInstance) {
        super(instance);
    }

    async getBoard(id: string): Promise<AxiosResponse<Session>> {
        return await this.instance.get(`session/${id}`);
    }
}
