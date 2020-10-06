import axios, {AxiosInstance, AxiosResponse} from "axios";
import BoardApiSection from "./boardApiSection";
import SessionApiSection from "./sessionApiSection";
import Session from "../types/session/session";
import {SignInCredentials} from "../types/auth/signInCredentials";
import GameApiSection from "./gameApiSection";
import InvitationApiSection from "./invitationApiSection";
import ProfileApiSection from "./profileApiSection";

export class Api {

    public authorized: boolean = false;
    public board: BoardApiSection;
    public session: SessionApiSection;
    public game: GameApiSection;
    public profile: ProfileApiSection;
    public invitations: InvitationApiSection;
    private instance: AxiosInstance;
    private readonly baseURL: string;

    private unAuthorizedApi = axios.create({
        baseURL:this.baseURL,
    });

    constructor(baseURL: string, token: string | null = null) {
        this.baseURL = baseURL;
        this.authorized = false;
        this.instance = this.unAuthorizedApi;
        this.board = new BoardApiSection(this.instance);
        this.session = new SessionApiSection(this.instance);
        this.game = new GameApiSection(this.instance);
        this.invitations = new InvitationApiSection(this.instance);
        this.profile = new ProfileApiSection(this.instance);
    }


    async signIn(credentials: SignInCredentials) {
        const response: AxiosResponse = await this.instance.post(`auth/login`, credentials);
        this.authorized = true;
        const token: string = response.headers["x-auth-token"];
        this.instance = this.createInstance(token);
        this.authorized = true;

    }

    signOut() {
        this.authorized = false;
        this.instance = this.unAuthorizedApi;
    }

    async createSession(): Promise<AxiosResponse<Session>> {
        return await this.instance.post("sessions");
    }

    private createInstance = (token?: string) => {
        return token ? axios.create({
            baseURL: this.baseURL,
            headers: {Authorization: `Bearer ${token}`},
        }) : axios.create({
            baseURL: this.baseURL,
        });

    }
}

const api = new Api('http:/localhost:5000/api/');
export default api;
