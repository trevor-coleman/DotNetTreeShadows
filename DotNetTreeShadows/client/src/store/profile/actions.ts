import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";
import {Profile} from "../../types/profile/profile";
import {FriendProfile} from "../../types/profile/friendProfile";


export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async ():Promise<Profile> =>{
        const response = await api.profile.get();
        return response.data;
    })

export const fetchFriendProfiles = createAsyncThunk(
    'profile/fetchFriendProfiles',
    async ():Promise<FriendProfile[]> => {
        const response = await api.profile.getFriends();
        return response.data;

    }
)


