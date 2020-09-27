import { GET_NEW_SESSION_REQUEST, GET_NEW_SESSION_FAILURE, GET_NEW_SESSION_SUCCESS, Session } from './types';
import { createAsyncAction } from 'typesafe-actions';

export const getNewSession = createAsyncAction(GET_NEW_SESSION_REQUEST,
  GET_NEW_SESSION_SUCCESS,
  GET_NEW_SESSION_FAILURE)<undefined, Session, string>();
