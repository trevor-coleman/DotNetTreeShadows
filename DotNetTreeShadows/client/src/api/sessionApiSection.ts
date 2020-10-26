import {AApiSection} from "./aApiSection";
import axios, {AxiosResponse} from "axios";
import {Session} from '../store/session/types'
export default class SessionApiSection extends AApiSection {
    async get(id: string): Promise<AxiosResponse<Session>> {
        return await axios.get(`sessions/${id}`);
    }

    async create(): Promise<AxiosResponse<Session>> {
        return await axios.post("sessions");
    }

    async delete(id: string) {
        return await axios.delete(`sessions/${id}`)
    }

  public async join(sessionId: string)  {
    return await axios.post(`profiles/me/sessions/${sessionId}`);
  }
}
