import {createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {SignInCredentials} from "./types/signInCredentials";

import {NewUserInfo} from "./types/newUserInfo";
import {ExtraInfo} from "../extraInfo";
import {
  AuthApiResult, AuthApiDuplicateUsernameResult,
} from '../../api/authApiSection';

export type AnyAction = {
    type: any,
    payload?: any,
    meta?: any,
}

export const checkIfUsernameExists = createAsyncThunk<AuthApiDuplicateUsernameResult, {username:string, id: string}, ExtraInfo>("auth/checkIfUserNameExists",
    async ({username, id}, {extra})=>{
      const {api} = extra;
      const result:AuthApiDuplicateUsernameResult = await api.auth.usernameIsDuplicate(username, id);
      return result;
})

export const signIn = createAsyncThunk<AuthApiResult, SignInCredentials, ExtraInfo>("auth/signIn",
    async (credentials, {extra}) => {
        const {api} = extra;
        const result: AuthApiResult = await api.auth.signIn(credentials);
        return result;
    })



export const registerNewUser = createAsyncThunk<AuthApiResult, NewUserInfo, ExtraInfo>('auth/registerNewUser',
    async (newUserInfo, {extra}) => {
        const {api} = extra;
        const result = await api.auth.registerNewUser(newUserInfo);
        return result;
    }
)



