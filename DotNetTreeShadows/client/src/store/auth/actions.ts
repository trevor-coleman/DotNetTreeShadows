import {createAsyncThunk, ThunkDispatch} from "@reduxjs/toolkit";
import {SignInCredentials} from "./types/signInCredentials";

import {NewUserInfo} from "./types/newUserInfo";
import {ExtraInfo, RootState} from "../store";
import {clearProfile, fetchProfile} from "../profile/reducer";
import { setToken } from "./reducer";
import {AppDispatch} from "../index";
import Api from "../../api/api";
import {fetchInvitations} from "../invitations/reducer";

export type AnyAction = {
    type: any,
    payload?: any,
    meta?: any,
}

export const signIn = createAsyncThunk<string|null, SignInCredentials, ExtraInfo>("auth/signIn",
    async (credentials, {extra}) =>{
    const {api}= extra;
    return await api.auth.signIn(credentials);
    })

export const signInAndFetchProfile = (credentials: SignInCredentials) => async (dispatch: AppDispatch) => {
    dispatch(clearProfile());
    await dispatch(signIn(credentials));
    await dispatch(fetchProfile());
    await dispatch(fetchInvitations());

};



export const registerNewUser = createAsyncThunk<any,NewUserInfo, ExtraInfo>('auth/registerNewUser',
    async (newUserInfo, {extra}) => {
    const {api}= extra;
    const response = await api.auth.registerNewUser(newUserInfo);
        return response.data;
    }
)

export const registerAndSignIn = (newUserInfo: NewUserInfo) => async (dispatch: AppDispatch, _:any, api:Api) => {
    const registerResponse = await dispatch(registerNewUser(newUserInfo));
    const signInResponse = await dispatch(signIn({
        email: newUserInfo.email,
        password: newUserInfo.password
    }));
    return signInResponse;
};


