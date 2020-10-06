import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import {Board} from "../store/board/board";

export default class BoardApiSection extends AApiSection {
    public constructor(instance:AxiosInstance) {
        super(instance);
    }

    async get(id: string): Promise<AxiosResponse<Board>> {
        return await this.instance.get(`board/${id}`);
    }
}
