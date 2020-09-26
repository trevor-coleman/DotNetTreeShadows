export interface FriendsState {
    friends: FriendProfile[];
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

export const ADD_FRIEND_REQUEST ='ADD_FRIEND_REQUEST';
export const ADD_FRIEND_SUCCESS ='ADD_FRIEND_SUCCESS';
export const ADD_FRIEND_FAILURE ='ADD_FRIEND_FAILURE';

export interface AddFriendRequest {
    type: typeof ADD_FRIEND_REQUEST
    payload: string
}

export interface AddFriendSuccess {
    type: typeof ADD_FRIEND_SUCCESS
}

export interface AddFriendFailure {
    type: typeof ADD_FRIEND_FAILURE
    payload:string;
}

export type KnownFriendAction = AddFriendSuccess | AddFriendRequest | AddFriendFailure | GetFriendsFailure | GetFriendsRequest | GetFriendsSuccess;
