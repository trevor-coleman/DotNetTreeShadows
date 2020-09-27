export interface InvitationsState {
  sentInvitations: Invitation[];
  receivedInvitations: Invitation[];
}

export interface Invitation {
  id:string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  resourceId: string;
  invitationType: InvitationType;
  created: string;
  invitationStatus: InvitationStatus
}

export type InvitationStatus = "Accepted" | "Declined" | "Cancelled" | "Pending";
export type InvitationType = "FriendRequest" | "SessionInvite";

export type KnownInvitationAction =
  GetReceivedInvitationsAction
  | GetSentInvitationsAction
  | CancelRequestAction
  | DeclineInvitationAction
  | AcceptInvitationAction;

export const GET_SENT_INVITATIONS_REQUEST = 'GET_SENT_INVITATIONS_REQUEST';
export const GET_SENT_INVITATIONS_SUCCESS = 'GET_SENT_INVITATIONS_SUCCESS';
export const GET_SENT_INVITATIONS_FAILURE = 'GET_SENT_INVITATIONS_FAILURE';

export interface GetSentInvitationsRequest {
  type: typeof GET_SENT_INVITATIONS_REQUEST
}

export interface GetSentInvitationsSuccess {
  type: typeof GET_SENT_INVITATIONS_SUCCESS
  payload: Invitation[];
}

export interface GetSentInvitationsFailure {
  type: typeof GET_SENT_INVITATIONS_FAILURE
  payload: string
}

type GetSentInvitationsAction = GetSentInvitationsFailure | GetSentInvitationsRequest | GetSentInvitationsSuccess;

export const GET_RECEIVED_INVITATIONS_REQUEST = 'GET_RECEIVED_INVITATIONS_REQUEST';
export const GET_RECEIVED_INVITATIONS_SUCCESS = 'GET_RECEIVED_INVITATIONS_SUCCESS';
export const GET_RECEIVED_INVITATIONS_FAILURE = 'GET_RECEIVED_INVITATIONS_FAILURE';

export interface GetReceivedInvitationsRequest {
  type: typeof GET_RECEIVED_INVITATIONS_REQUEST
}

export interface GetReceivedInvitationsSuccess {
  type: typeof GET_RECEIVED_INVITATIONS_SUCCESS
  payload: Invitation[];
}

export interface GetReceivedInvitationsFailure {
  type: typeof GET_RECEIVED_INVITATIONS_FAILURE
  payload: string
}

type GetReceivedInvitationsAction =
  GetReceivedInvitationsFailure
  | GetReceivedInvitationsRequest
  | GetReceivedInvitationsSuccess;

export const ACCEPT_INVITATION_REQUEST = 'ACCEPT_INVITATION_REQUEST';
export const ACCEPT_INVITATION_SUCCESS = 'ACCEPT_INVITATION_SUCCESS';
export const ACCEPT_INVITATION_FAILURE = 'ACCEPT_INVITATION_FAILURE';

export interface AcceptInvitationRequest {
  type: typeof ACCEPT_INVITATION_REQUEST;
  payload: string;
}

export interface AcceptInvitationSuccess {
  type: typeof ACCEPT_INVITATION_SUCCESS;
}

export interface AcceptInvitationFailure {
  type: typeof ACCEPT_INVITATION_FAILURE;
  payload: string;
}

type AcceptInvitationAction = AcceptInvitationFailure | AcceptInvitationRequest | AcceptInvitationSuccess;

export const DECLINE_INVITATION_REQUEST = 'DECLINE_INVITATION_REQUEST';
export const DECLINE_INVITATION_SUCCESS = 'DECLINE_INVITATION_SUCCESS';
export const DECLINE_INVITATION_FAILURE = 'DECLINE_INVITATION_FAILURE';

export interface DeclineInvitationRequest {
  type: typeof DECLINE_INVITATION_REQUEST;
  payload: string;
}

export interface DeclineInvitationSuccess {
  type: typeof DECLINE_INVITATION_SUCCESS
}

export interface DeclineInvitationFailure {
  type: typeof DECLINE_INVITATION_FAILURE
  payload: string
}

type DeclineInvitationAction = DeclineInvitationRequest | DeclineInvitationSuccess | DeclineInvitationFailure;

export const CANCEL_INVITATION_REQUEST = 'CANCEL_REQUEST_REQUEST';
export const CANCEL_INVITATION_SUCCESS = 'CANCEL_REQUEST_SUCCESS';
export const CANCEL_INVITATION_FAILURE = 'CANCEL_REQUEST_FAILURE';

export interface CancelInvitationRequest {
  type: typeof CANCEL_INVITATION_REQUEST
  payload: string;
}

export interface CancelInvitationSuccess {
  type: typeof CANCEL_INVITATION_SUCCESS

}

export interface CancelInvitationFailure {
  type: typeof CANCEL_INVITATION_FAILURE
  payload: string
}

type CancelRequestAction = CancelInvitationRequest | CancelInvitationSuccess | CancelInvitationFailure;

