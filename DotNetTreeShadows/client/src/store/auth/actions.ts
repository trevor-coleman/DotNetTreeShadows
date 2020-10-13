import {createAsyncThunk, unwrapResult} from "@reduxjs/toolkit";
import {SignInCredentials} from "./types/signInCredentials";

import {NewUserInfo} from "./types/newUserInfo";
import {ExtraInfo} from "../store";
import {clearProfile, fetchProfile} from "../profile/reducer";
import {AppDispatch} from "../index";
import Api from "../../api/api";
import {fetchInvitations} from "../invitations/reducer";

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

export const signInAndFetchProfile = (credentials: SignInCredentials) => async (dispatch: AppDispatch) => {
    dispatch(clearProfile());
    const result = unwrapResult(await dispatch(signIn(credentials)));
    await dispatch(fetchProfile());
    await dispatch(fetchInvitations());
    return result != null;
};


export const registerNewUser = createAsyncThunk<any, NewUserInfo, ExtraInfo>('auth/registerNewUser',
    async (newUserInfo, {extra}) => {
        const {api} = extra;
        const response = await api.auth.registerNewUser(newUserInfo);
        return response.data;
    }
)

export const registerAndSignIn = (newUserInfo: NewUserInfo) => async (dispatch: AppDispatch, _: any, api: Api) => {
    try {
        const registerResponse = await dispatch(registerNewUser(newUserInfo));
        const signInResponse = await dispatch(signInAndFetchProfile({
            email: newUserInfo.email,
            password: newUserInfo.password
        }));
        console.log("returning signInResponse", signInResponse)
        return signInResponse !== null;

    } catch (e) {
        return null;
    }
};


