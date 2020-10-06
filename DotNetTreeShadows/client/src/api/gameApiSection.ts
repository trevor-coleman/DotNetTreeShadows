import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import Game from "../store/game/game";

export default class GameApiSection extends AApiSection {
    public constructor(instance: AxiosInstance) {
        super(instance);
    }

    async getGame(id: string): Promise<AxiosResponse<Game>> {
        return await this.instance.get(`game/${id}`)
    }


}
