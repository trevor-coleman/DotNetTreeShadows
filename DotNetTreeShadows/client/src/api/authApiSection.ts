import {AApiSection} from "./aApiSection";
import {SignInCredentials} from "../store/auth/types/signInCredentials";
import axios, {AxiosResponse} from "axios";
import {NewUserInfo} from "../store/auth/types/newUserInfo";

export default class AuthApiSection extends AApiSection {
    async signIn(credentials: SignInCredentials): Promise<string | null> {
        try {
            const response: AxiosResponse = await axios.post("auth/login", credentials);
            const token: string | null = response.headers["x-auth-token"];
            return token
        } catch (e) {
            console.warn(`Sign In Failed for ${credentials.email}`)
            console.warn(e)
        }
        return null;
    }

    async registerNewUser(newUserInfo: NewUserInfo) {
        return await axios.post("auth/register", newUserInfo);
    }


}
