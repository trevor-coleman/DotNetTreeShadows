import {AxiosInstance} from "axios";

export abstract class AApiSection {
    protected instance: AxiosInstance;

    protected constructor(instance:AxiosInstance) {
        this.instance = instance;
    }
}

