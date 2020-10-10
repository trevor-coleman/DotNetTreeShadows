import {AApiSection} from "./aApiSection";
import axios, {AxiosResponse} from "axios";
import {Board} from "../store/board/types/board";

    export default class BoardApiSection extends AApiSection {
        async get(id: string): Promise<AxiosResponse<Board>> {
            return await axios.get(`board/${id}`);
        }
    }

