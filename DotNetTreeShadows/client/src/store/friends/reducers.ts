import {
  FriendsState,
  KnownFriendAction,
  SEND_FRIEND_REQUEST_SUCCESS,
  SEND_FRIEND_REQUEST_REQUEST,
  SEND_FRIEND_REQUEST_FAILURE,
  GET_FRIENDS_FAILURE,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  RESET_FRIEND_REQUEST
} from './types';

const initialFriendsState: FriendsState = {

  friends: [],
  gettingFriends: false,
  sendingFriendRequest: false,
  sendFriendRequestResultMessage: null,
  sendFriendRequestSucceeded: false,
};

export function friendsReducer(state = initialFriendsState, action: KnownFriendAction): FriendsState {
  switch (action.type) {
    case RESET_FRIEND_REQUEST:
      return {...state,
        sendFriendRequestSucceeded: false,
        sendFriendRequestResultMessage:null,
        sendingFriendRequest: false
      }
    case SEND_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        sendingFriendRequest: false,
        sendFriendRequestResultMessage: null,
        sendFriendRequestSucceeded: true,
      };
    case SEND_FRIEND_REQUEST_REQUEST:
      return {
        ...state,
        sendingFriendRequest: true,
        sendFriendRequestResultMessage: null,
        sendFriendRequestSucceeded: false,
      };
    case SEND_FRIEND_REQUEST_FAILURE:
      return {
        ...state,
        sendingFriendRequest: false,
        sendFriendRequestResultMessage: action.payload,
        sendFriendRequestSucceeded: false,
      };
    case GET_FRIENDS_FAILURE:
      return {
        ...state,
        gettingFriends: false,
      };
    case GET_FRIENDS_REQUEST:
      return {
        ...state,
        gettingFriends: true,
      };
    case GET_FRIENDS_SUCCESS:
      return {
        ...state,
        friends: action.payload,
        gettingFriends: false,
      };
    default:
      return {...state};
  }
}
