import {
  CREATE_SESSION_REQUEST,
  CREATE_SESSION_FAILURE,
  CREATE_SESSION_SUCCESS,
  Session,
  GET_SESSION_REQUEST,
  GET_SESSION_FAILURE, GET_SESSION_SUCCESS,
} from './types';
import { createAsyncAction } from 'typesafe-actions';

export const createSession = createAsyncAction(CREATE_SESSION_REQUEST,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_FAILURE)<undefined, Session, string>();

export const getSession = createAsyncAction(GET_SESSION_REQUEST,
  GET_SESSION_SUCCESS,
  GET_SESSION_FAILURE)<string, Session, string>();
