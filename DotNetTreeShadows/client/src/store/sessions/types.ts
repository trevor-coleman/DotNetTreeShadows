import {HexCoordinates} from '../../models/hex-grid/HexCoordinates';
import {KnownBoardAction} from '../board/types';

export type KnownSessionAction = CreateNewSessionAction | GetSessionAction | KnownBoardAction;

export type SessionState = {
  session: Session | null;
  sessionLoading: boolean;
  sessionLoadingFailureMessage: string | null;
}

export type Session = {
  id:string;
  host:string;
  players: string[]
  name: string;
  invitations: string[];
}





export const CREATE_SESSION_REQUEST ='CREATE_SESSION_REQUEST';
export const CREATE_SESSION_SUCCESS ='CREATE_SESSION_SUCCESS';
export const CREATE_SESSION_FAILURE ='CREATE_SESSION_FAILURE';

export interface CreateSessionRequest {
    type: typeof CREATE_SESSION_REQUEST
}

export interface CreateSessionSuccess {
    type: typeof CREATE_SESSION_SUCCESS
    payload: Session
}

export interface CreateSessionFailure {
    type: typeof CREATE_SESSION_FAILURE
    payload: string
}

type CreateNewSessionAction = CreateSessionRequest | CreateSessionSuccess | CreateSessionFailure;

export const GET_SESSION_REQUEST ='GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS ='GET_SESSION_SUCCESS';
export const GET_SESSION_FAILURE ='GET_SESSION_FAILURE';

export interface GetSessionRequest {
    type: typeof GET_SESSION_REQUEST
    payload: string;
}

export interface GetSessionSuccess {
    type: typeof GET_SESSION_SUCCESS
    payload: Session;
}

export interface GetSessionFailure {
    type: typeof GET_SESSION_FAILURE
    payload: string
}

type GetSessionAction = GetSessionRequest | GetSessionSuccess | GetSessionFailure;



