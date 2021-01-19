import axios, {AxiosRequestConfig} from "axios";
import AuthApiSection from "./authApiSection";
import SessionApiSection from "./sessionApiSection";
import GameApiSection from "./gameApiSection";
import InvitationApiSection from "./invitationApiSection";
import ProfileApiSection from "./profileApiSection";
import BoardApiSection from "./boardApiSection";
import { Store } from 'redux';
import { signOutAndClearStore } from '../store/auth/thunks';
import { AppStore } from '../store/store';



export default class Api {

    public authorized: boolean = false;
    public board: BoardApiSection;
    public session: SessionApiSection;
    public auth: AuthApiSection;
    public game: GameApiSection;
    public profile: ProfileApiSection;
    public invitations: InvitationApiSection;
    private readonly baseURL: string;
    private getToken:()=>string|null = ()=>null;

    public static Create(getToken: ()=>string|null, baseURL:string) {
      return new Api(getToken, baseURL)
    }

    constructor(getToken:()=>string|null , baseURL: string) {

        this.baseURL = baseURL;
        this.auth = new AuthApiSection();
        this.board = new BoardApiSection();
        this.session = new SessionApiSection();
        this.game = new GameApiSection();
        this.invitations = new InvitationApiSection();
        this.profile = new ProfileApiSection();
        this.getToken = getToken;

        axios.interceptors.request.use(this.axiosInterceptor);



    }

    private axiosInterceptor = (config: AxiosRequestConfig) => {
        const token = this.getToken() ?? null;
        return {
            ...config,
            baseURL: this.baseURL,
            headers: token ? {
                ...config.headers,
                Authorization: `Bearer ${token}`
            } : {...config.headers}
        }
    }

  public addInterceptors(store:AppStore): void {
    axios.interceptors.response.use(response => {
      return response;
    }, error => {
      if (error.response.status === 401) {
        store.dispatch(signOutAndClearStore())
      }
      return Promise.reject(error);
    });

  }
}
