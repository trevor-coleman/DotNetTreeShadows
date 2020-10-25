import {AApiSection} from "./aApiSection";
import axios, {AxiosResponse} from "axios";
import Game from "../store/game/types/game";
import { ActionRequest } from '../store/game/actions';

export default class GameApiSection extends AApiSection {
    async get(id: string): Promise<AxiosResponse<Game>> {
        return await axios.get(`game/${id}`)
    }

  public async sendAction({sessionId, actionRequest}: {sessionId:string, actionRequest:ActionRequest}): Promise<AxiosResponse<any>|{data:"none"}> {
    let result;
        try {
        result = await axios.post(`/sessions/${sessionId}/actions`, actionRequest);
    } catch (e) {
            console.log(e.response.data);
            return {data: e.response.data};
    }
    return  result
  }
}
