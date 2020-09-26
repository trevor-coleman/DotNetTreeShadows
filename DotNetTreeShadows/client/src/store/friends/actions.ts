import { createAsyncAction, createAction } from 'typesafe-actions';
import {
  FriendProfile,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAILURE,
  SEND_FRIEND_REQUEST_FAILURE,
  SEND_FRIEND_REQUEST_REQUEST,
  SEND_FRIEND_REQUEST_SUCCESS,
  RESET_FRIEND_REQUEST,
} from './types';

export const getFriends = createAsyncAction(GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAILURE)<undefined, FriendProfile[], string>();

export const sendFriendRequest = createAsyncAction(SEND_FRIEND_REQUEST_REQUEST,
  SEND_FRIEND_REQUEST_SUCCESS,
  SEND_FRIEND_REQUEST_FAILURE)<string, undefined, string>();

export const resetFriendRequest = createAction(RESET_FRIEND_REQUEST);


