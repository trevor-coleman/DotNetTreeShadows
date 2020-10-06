import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";
import {Profile} from "./profile";
import {FriendProfile} from "./friendProfile";
import {SessionSummary} from "./reducer";


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

