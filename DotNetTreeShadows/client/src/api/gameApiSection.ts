import {AApiSection} from "./aApiSection";
import {AxiosInstance, AxiosResponse} from "axios";
import Game from "../store/game/game";
import { ActionRequest } from '../store/game/actions';

export default class GameApiSection extends AApiSection {
    public constructor(instance: AxiosInstance) {
        super(instance);
    }

    async getGame(id: string): Promise<AxiosResponse<Game>> {
        return await this.instance.get(`game/${id}`)
    }

  public async sendActionRequest({sessionId, actionRequest}: {sessionId:string, actionRequest:ActionRequest}): Promise<AxiosResponse<any>> {
    return await this.instance.post(`/sessions/${sessionId}/actions`, actionRequest);
  }
}
