import { fetchUserProfile } from '../user/actions';
import axios, { AxiosResponse } from 'axios';
import { Profile } from '../user/types';
import { AppThunk } from '../middleware/thunks';
import { SignInCredentials, SignInResponse, NewUserInfo } from './types';
import { signInUser, registerNewUser } from './actions';
import { fetchUserProfileAsync } from '../user/thunks';

export const signInUserAsync = (credentials:SignInCredentials) : AppThunk => async dispatch => {
    dispatch(signInUser.request(credentials));
    try {
        const asyncResp: AxiosResponse = await axios.post('authenticate/login', credentials, {baseURL: "https://localhost:5001/api/"});
        const signInResponse = asyncResp.data as SignInResponse;
        dispatch(signInUser.success(signInResponse));
        dispatch(fetchUserProfileAsync());
    } catch (e) {
        dispatch(fetchUserProfile.failure(e.message));
    }
}


export const registerNewUserAsync = (newUserInfo:NewUserInfo) : AppThunk => async dispatch => {
    dispatch(registerNewUser.request(newUserInfo));
    try {
        const asyncResp: AxiosResponse = await axios.post('authenticate/register', newUserInfo, {baseURL: "https://localhost:5001/api/"});
        dispatch(registerNewUser.success(newUserInfo));
        dispatch(signInUserAsync({email: newUserInfo.email, password: newUserInfo.password}))
    } catch (e) {
        dispatch(fetchUserProfile.failure(e.message));
    }
}
