import { AApiSection } from "./aApiSection";
import { SignInCredentials } from "../store/auth/types/signInCredentials";
import axios, { AxiosResponse} from "axios";
import { NewUserInfo } from "../store/auth/types/newUserInfo";

export type AuthApiResult = {
  success: boolean;
  token?: string;
  message: string;
};

export type AuthApiDuplicateUsernameResult = {
  success: boolean;
  username: string;
  isDuplicate?: boolean | null;
  id: string;
};

function handleAuthApiErrors(error: {
  response: AxiosResponse;
}): AuthApiResult {
  const result: AuthApiResult = {
    message: "",
    success: false
  };
  const { data } = error.response;
  if (error.response.data.message) {
    result.message = error.response.data.message;
  }
  if (data.errors) {
    console.log("Errors");
    console.log(data.errors);
    Object.keys(data.errors).forEach(key => {
      result.message =
        result.message +
        data.errors[key].reduce((s: string, c: string) => s + c + " ");
    });
  }
  return result;
}

export default class AuthApiSection extends AApiSection {
  async signIn(credentials: SignInCredentials): Promise<AuthApiResult> {
    let result: AuthApiResult = {
      success: false,
      message: ""
    };
    await axios
      .post("auth/login", credentials)
      .then(response => {
        result.success = response.status === 200;
        result.message = response.statusText;
        result.token = response.headers["x-auth-token"];
      })
      .catch(error => (result = { ...handleAuthApiErrors(error) }));

    return result;
  }

  async registerNewUser(newUserInfo: NewUserInfo) {
    let result: AuthApiResult = {
      success: false,
      message: ""
    };
    await axios
      .post("auth/register", newUserInfo)
      .then(response => {
        result.success = response.status === 200;
        result.message = response.statusText;
        result.token = response.headers["x-auth-token"];
      })
      .catch(error => (result = { ...handleAuthApiErrors(error) }));

    console.log(result);
    return result;
  }

  async usernameIsDuplicate(
    username: string,
    id: string
  ): Promise<AuthApiDuplicateUsernameResult> {
    let result: AuthApiDuplicateUsernameResult = {
      username,
      id,
      isDuplicate: null,
      success: false
    };

    await axios
      .post("auth/check-if-duplicate", {username})
      .then(response => {
        result.success = true;
        result.isDuplicate = response.data;
      })
      .catch(() => {
        result.success = false;
      });

    return result;
  }

}
