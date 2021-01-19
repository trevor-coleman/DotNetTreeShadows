import {SignInCredentials} from "./types/signInCredentials";
import {AppDispatch} from "../index";
import {clearProfile, fetchProfile} from "../profile/reducer";
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchInvitations} from "../invitations/actions";
import {registerNewUser, signIn} from "./actions";
import {NewUserInfo} from "./types/newUserInfo";
import Api from "../../api/api";
import { signOut } from "./reducer";
import { clearStore } from '../rootReducer';
import { AuthApiResult } from '../../api/authApiSection';

export const signInAndFetchProfile = (credentials: SignInCredentials) => async (dispatch: AppDispatch) => {
  dispatch(clearProfile());
  const result:AuthApiResult = unwrapResult(await dispatch(signIn(credentials))) as AuthApiResult;
  if(result.success) {
    await dispatch(fetchProfile());
    await dispatch(fetchInvitations());
  }
  return result;
};

export const signOutAndClearStore = () => async (dispatch: AppDispatch) => {
  dispatch(signOut());
  dispatch(clearStore());
}

export const registerAndSignIn = (newUserInfo: NewUserInfo) => async (dispatch: AppDispatch, _: any, api: Api) => {
  try {
    const registerResponse:AuthApiResult = await dispatch(registerNewUser(newUserInfo));
    if(registerResponse.success) {
      const signInResponse = await dispatch(signInAndFetchProfile({
        email: newUserInfo.email,
        password: newUserInfo.password
      }));
      console.log("returning signInResponse", signInResponse)
      return signInResponse;
    }
    return registerResponse;

  } catch (e) {
    return null;
  }
};
