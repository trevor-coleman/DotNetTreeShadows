import {
  UserState,
  KnownUserAction,
  SET_USER_PROFILE,
  CLEAR_USER_PROFILE,
  FETCH_USER_PROFILE_SUCCESS,
  GET_SESSIONS_INFO_REQUEST,
  GET_SESSIONS_INFO_SUCCESS,
  GET_SESSIONS_INFO_FAILURE,
} from './types';

const initialState: UserState = {
  id: '',
  loggedIn: false,
  profile: undefined,
};

export function userReducer(state = initialState, action: KnownUserAction): UserState {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {...state, profile: action.payload}
    case GET_SESSIONS_INFO_REQUEST:
      return {...state};
    case GET_SESSIONS_INFO_SUCCESS:
      return {
        ...state,
        profile: state.profile
                 ? {
            ...state.profile,
            sessions: action.payload,
          }
                 : undefined,
      };
    case GET_SESSIONS_INFO_FAILURE:
      return {...state};
    case FETCH_USER_PROFILE_SUCCESS:
      console.log("Setting profile");
      return {
        ...state,
        profile: action.payload,
      };
    case CLEAR_USER_PROFILE:
      return {
        ...state,
        profile: undefined,
      };
    default:
      return state;
  }

}
