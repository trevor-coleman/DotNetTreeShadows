import axios, {AxiosInstance, AxiosResponse} from "axios";
import BoardApiSection from "./boardApiSection";
import SessionApiSection from "./sessionApiSection";
import {Session} from "../store/session/session";
import {SignInCredentials} from "../store/auth/signInCredentials";
import GameApiSection from "./gameApiSection";
import InvitationApiSection from "./invitationApiSection";
import ProfileApiSection from "./profileApiSection";
import {NewUserInfo} from "../store/auth/newUserInfo";

export class Api {

    public authorized: boolean = false;
    public board: BoardApiSection;
    public session: SessionApiSection;
    public game: GameApiSection;
    public profile: ProfileApiSection;
    public invitations: InvitationApiSection;
    private instance: AxiosInstance;
    private readonly baseURL: string;

    private unAuthorizedApi = () => axios.create({
        baseURL:this.baseURL,
    });

    constructor(baseURL: string, token: string | null = null) {

        this.baseURL = baseURL;
        this.authorized = false;
        this.instance = this.unAuthorizedApi();
        this.board = new BoardApiSection(this.instance);
        this.session = new SessionApiSection(this.instance);
        this.game = new GameApiSection(this.instance);
        this.invitations = new InvitationApiSection(this.instance);
        this.profile = new ProfileApiSection(this.instance);
    }


    private createSections() {
        this.board = new BoardApiSection(this.instance);
        this.session = new SessionApiSection(this.instance);
        this.game = new GameApiSection(this.instance);
        this.invitations = new InvitationApiSection(this.instance);
        this.profile = new ProfileApiSection(this.instance);
    }

    async signIn(credentials: SignInCredentials) {
        try {
            console.log(this.baseURL);
            const response: AxiosResponse = await this.instance.post("auth/login", credentials);
            this.authorized = true;
            const token: string = response.headers["x-auth-token"];
            this.instance = this.createInstance(token);
            this.createSections();
            this.authorized = true;
        } catch (e) {
            console.log(e)
        }

    }

    signOut() {
        this.authorized = false;
        this.instance = this.unAuthorizedApi();
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

    async registerNewUser(newUserInfo: NewUserInfo) {
        return await this.instance.post("auth/register", newUserInfo);
    }

    async getSession(sessionId: string) {
        return await this.instance.get(`sessions/${sessionId}`)
    }
}

const api = new Api("/api/");
export default api;
