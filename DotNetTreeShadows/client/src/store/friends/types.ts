export const RESET_FRIEND_REQUEST = 'RESET_FRIEND_REQUEST';

export interface FriendsState {
    friends: FriendProfile[];
    sendingFriendRequest: boolean;
    gettingFriends: boolean;
    sendFriendRequestResultMessage: string | null;
    sendFriendRequestSucceeded: boolean
}

export interface FriendProfile {
    name: string;
    id: string;
}



export const GET_FRIENDS_REQUEST ='GET_FRIENDS_REQUEST';
export const GET_FRIENDS_SUCCESS ='GET_FRIENDS_SUCCESS';
export const GET_FRIENDS_FAILURE ='GET_FRIENDS_FAILURE';

export interface GetFriendsRequest {
    type: typeof GET_FRIENDS_REQUEST
}

export interface GetFriendsSuccess {
    type: typeof GET_FRIENDS_SUCCESS
    payload: FriendProfile[]
}

export interface GetFriendsFailure {
    type: typeof GET_FRIENDS_FAILURE
}

export const SEND_FRIEND_REQUEST_REQUEST ='SEND_FRIEND_REQUEST_REQUEST';
export const SEND_FRIEND_REQUEST_SUCCESS ='SEND_FRIEND_REQUEST_SUCCESS';
export const SEND_FRIEND_REQUEST_FAILURE ='SEND_FRIEND_REQUEST_FAILURE';

export interface SendFriendRequestRequest {
    type: typeof SEND_FRIEND_REQUEST_REQUEST
    payload: string
}

export interface SendFriendRequestSuccess {
    type: typeof SEND_FRIEND_REQUEST_SUCCESS
}

export interface SendFriendRequestFailure {
    type: typeof SEND_FRIEND_REQUEST_FAILURE
    payload:string;
}

export interface ResetFriendRequest {
  type:typeof RESET_FRIEND_REQUEST;
}

export type KnownFriendAction = SendFriendRequestSuccess | SendFriendRequestRequest | SendFriendRequestFailure | GetFriendsFailure | GetFriendsRequest | GetFriendsSuccess | ResetFriendRequest;
