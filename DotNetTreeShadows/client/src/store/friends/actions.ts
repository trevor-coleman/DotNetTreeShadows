import { createAsyncAction } from 'typesafe-actions';
import {
    GET_FRIENDS_REQUEST,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_FAILURE,
    FriendProfile,
    ADD_FRIEND_FAILURE,
    ADD_FRIEND_REQUEST,
    ADD_FRIEND_SUCCESS,
} from './types';

export const getFriends = createAsyncAction(GET_FRIENDS_REQUEST,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_FAILURE)<undefined, FriendProfile[], string>();

export const addFriend = createAsyncAction(ADD_FRIEND_REQUEST,
    ADD_FRIEND_SUCCESS,
    ADD_FRIEND_FAILURE)<string, undefined, string>();
