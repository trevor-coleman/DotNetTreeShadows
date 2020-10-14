import {createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {SignInCredentials} from "./types/signInCredentials";

import {NewUserInfo} from "./types/newUserInfo";
import {ExtraInfo} from "../extraInfo";

export type AnyAction = {
    type: any,
    payload?: any,
    meta?: any,
}

export const signIn = createAsyncThunk<string | null, SignInCredentials, ExtraInfo>("auth/signIn",
    async (credentials, {extra}) => {
        const {api} = extra;
        const result = await api.auth.signIn(credentials);
        console.log("signInResult", result)
        return result;
    })



export const registerNewUser = createAsyncThunk<any, NewUserInfo, ExtraInfo>('auth/registerNewUser',
    async (newUserInfo, {extra}) => {
        const {api} = extra;
        const response = await api.auth.registerNewUser(newUserInfo);
        return response.data;
    }
)



