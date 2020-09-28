export interface SystemState {
  id: string
  loggedIn: boolean
  token: string
  tokenExpiration: string | null,
  authInProgress: boolean
}

export const UPDATE_SESSION = 'UPDATE_SESSION';
export const SIGN_IN_USER_REQUEST = 'SIGN_IN_USER_REQUEST';
export const SIGN_IN_USER_SUCCESS = 'SIGN_IN_USER_SUCCESS';
export const SIGN_IN_USER_FAILURE = 'SIGN_IN_USER_FAILURE';

export const REGISTER_NEW_USER_REQUEST = 'REGISTER_NEW_USER_REQUEST';
export const REGISTER_NEW_USER_SUCCESS = 'REGISTER_NEW_USER_SUCCESS';
export const REGISTER_NEW_USER_FAILURE = 'REGISTER_NEW_USER_FAILURE';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface NewUserInfo {
  email: string;
  password: string;
  username: string;
}

interface RegisterNewUserRequest {
  type: typeof REGISTER_NEW_USER_REQUEST;
  payload: NewUserInfo;
}

interface RegisterNewUserSuccess {
  type: typeof REGISTER_NEW_USER_SUCCESS;
  payload: NewUserInfo;
}

interface RegisterNewUserFailure {
  type: typeof REGISTER_NEW_USER_FAILURE;
}

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION,
  payload: SystemState
}

interface SignInUserRequest {
  type: typeof SIGN_IN_USER_REQUEST
  payload: SignInCredentials
}

interface SignInUserSuccess {
  type: typeof SIGN_IN_USER_SUCCESS
  payload: SignInResponse
}

interface SignInUserFailure {
  type: typeof SIGN_IN_USER_FAILURE
  payload: string
}

export interface SignInResponse {
  id: string,
  token: string,
  expiration: string,
}

export type KnownSystemAction =
  UpdateSessionAction
  | SignInUserSuccess
  | SignInUserRequest
  | SignInUserFailure
  | RegisterNewUserFailure
  | RegisterNewUserRequest
  | RegisterNewUserSuccess;
