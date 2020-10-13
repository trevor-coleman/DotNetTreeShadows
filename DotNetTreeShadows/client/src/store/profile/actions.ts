import {Profile} from "./types/profile";
import {FriendProfile} from "./types/friendProfile";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {ExtraInfo} from "../store";
import {AppDispatch} from "../index";
import {ProfileState} from "./reducer";

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


export const updateProfileAsync = createAsyncThunk<
    Profile,
    { profileProp: keyof ProfileState,
        value: string,
        profile: Profile, },
    ExtraInfo>(
    "profile/updateProfileItem",
    async ({profileProp, value}, {extra}) => {
        const {api} = extra;
        try {
            const changeRequest = {
                [profileProp]: value
            }
            const response = await api.profile.updateProfile(changeRequest);
            return response.data;
        } catch (e) {
            return e.response.data;
        }
    });

export const removeFriendFromProfile = createAsyncThunk<void, string, ExtraInfo>(
    'profile/removeFriend',
    async (id, {extra}) => {
        const {api} = extra;

        const response = await api.profile.removeFriend(id);
        return;

    }
)
