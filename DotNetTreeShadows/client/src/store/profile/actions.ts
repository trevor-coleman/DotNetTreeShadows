import {Profile} from "./types/profile";
import {FriendProfile} from "./types/friendProfile";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {ExtraInfo} from "../store";
import {SignInCredentials} from "../auth/types/signInCredentials";
import {AppDispatch} from "../index";
import {clearProfile} from "./reducer";
import {fetchInvitations} from "../invitations/actions";
import {signIn} from "../auth/actions";

export const fetchProfile = createAsyncThunk<Profile, void, ExtraInfo>(
    'profile/fetchProfile',
    async (_, {extra}): Promise<Profile> => {
        const {api} = extra;
        const response = await api.profile.get();
        return response.data;
    })

export const fetchFriendProfiles = createAsyncThunk<FriendProfile[], void, ExtraInfo>(
    'profile/fetchFriendProfiles',
    async (_, {extra}): Promise<FriendProfile[]> => {
        const {api} = extra;
        const response = await api.profile.getFriends();
        return response.data;

    }
)

export const removeFriend = (id: string) => async (dispatch: AppDispatch) => {
    await dispatch(removeFriendFromProfile(id));
    await dispatch(fetchProfile());
};


export const removeFriendFromProfile = createAsyncThunk<void, string, ExtraInfo>(
    'profile/removeFriend',
    async (id, {extra}) => {
        const {api} = extra;

        const response = await api.profile.removeFriend(id);
        return;

    }
)
