import {createAsyncThunk, ThunkDispatch} from "@reduxjs/toolkit";
import {SignInCredentials} from "./signInCredentials";
import api from "../../api/api";
import {NewUserInfo} from "./newUserInfo";
import {RootState} from "../index";
import {sign} from "crypto";
import {fetchProfile, clearProfile} from "../profile/reducer";

export type AnyAction = {
    type: any,
    payload?: any,
    meta?: any,
}


export type TDispatch = ThunkDispatch<RootState, void, AnyAction>;


export const signIn = createAsyncThunk("auth/signIn",
    async (credentials: SignInCredentials) => {
    await api.signIn(credentials);
    })

export const signInAndFetchProfile = (credentials: SignInCredentials) => async (dispatch: ThunkDispatch<RootState, any, AnyAction>) => {
    dispatch(clearProfile())
    await dispatch(signIn(credentials));
    await dispatch(fetchProfile());
};



export const registerNewUser = createAsyncThunk('auth/registerNewUser',
    async (newUserInfo: NewUserInfo) => {
        const response = await api.registerNewUser(newUserInfo);
        return response.data;
    }
)

export const registerAndSignIn = (newUserInfo: NewUserInfo) => async (dispatch: ThunkDispatch<RootState, any, AnyAction>) => {
    const registerResponse = await dispatch(registerNewUser(newUserInfo));
    const signInResponse = await dispatch(signIn({
        email: newUserInfo.email,
        password: newUserInfo.password
    }));
    return signInResponse;
};


