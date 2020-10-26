import {AApiSection} from "./aApiSection";
import {SignInCredentials} from "../store/auth/types/signInCredentials";
import axios, {AxiosResponse} from "axios";
import {NewUserInfo} from "../store/auth/types/newUserInfo";

export default class AuthApiSection extends AApiSection {
    async signIn(credentials: SignInCredentials): Promise<string> {
            const response: AxiosResponse = await axios.post("auth/login", credentials);
        return response.headers["x-auth-token"]
    }

    async registerNewUser(newUserInfo: NewUserInfo) {
      const result = await axios.post("auth/register", newUserInfo);
      console.log(result)
      return result;
    }


}
