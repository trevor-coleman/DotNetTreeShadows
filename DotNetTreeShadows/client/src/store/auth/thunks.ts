import {SignInCredentials} from "./types/signInCredentials";
import {AppDispatch} from "../index";
import {clearProfile, fetchProfile} from "../profile/reducer";
import {unwrapResult} from "@reduxjs/toolkit";
import {fetchInvitations} from "../invitations/actions";
import {registerNewUser, signIn} from "./actions";
import {NewUserInfo} from "./types/newUserInfo";
import Api from "../../api/api";

export const signInAndFetchProfile = (credentials: SignInCredentials) => async (dispatch: AppDispatch) => {
  dispatch(clearProfile());
  const result = unwrapResult(await dispatch(signIn(credentials)));
  await dispatch(fetchProfile());
  await dispatch(fetchInvitations());
  return result != null;
};

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
