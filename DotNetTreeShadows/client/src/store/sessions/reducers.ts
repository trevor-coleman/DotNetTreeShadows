import {
  SessionState,
  KnownSessionAction,
  CreateSessionSuccess,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_REQUEST,
  GET_SESSION_REQUEST,
  GET_SESSION_FAILURE, GET_SESSION_SUCCESS,
} from './types';
import { HexCoordinates } from '../../models/hex-grid/HexCoordinates';

export const initialSessionState:SessionState = {session: null, sessionLoading:false, sessionLoadingFailureMessage:null}

export function sessionReducer(state:SessionState= initialSessionState, action: KnownSessionAction ): SessionState {
  switch (action.type) {
    case GET_SESSION_REQUEST:
      return {...state, sessionLoading: true, sessionLoadingFailureMessage:null};
    case GET_SESSION_SUCCESS:
      return {...state, session: action.payload, sessionLoading: false}
    case GET_SESSION_FAILURE:
      return {...state, sessionLoading: false, sessionLoadingFailureMessage: action.payload}
    case CREATE_SESSION_REQUEST:
      return {...state, sessionLoading: true, sessionLoadingFailureMessage:null};
    case CREATE_SESSION_SUCCESS:
      return {...state, session: action.payload, sessionLoading: false}
    case CREATE_SESSION_FAILURE:
      return {...state, sessionLoading: false, sessionLoadingFailureMessage: action.payload}
    default:
      return {...state};
  }
}
