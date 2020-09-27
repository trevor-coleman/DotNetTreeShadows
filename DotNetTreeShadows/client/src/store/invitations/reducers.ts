import {
  InvitationsState,
  KnownInvitationAction,
  DECLINE_INVITATION_SUCCESS,
  GET_SENT_INVITATIONS_SUCCESS,
  DECLINE_INVITATION_FAILURE,
  GET_RECEIVED_INVITATIONS_FAILURE,
  GET_SENT_INVITATIONS_FAILURE,
  CANCEL_INVITATION_REQUEST,
  CANCEL_INVITATION_FAILURE,
  GET_SENT_INVITATIONS_REQUEST,
  DECLINE_INVITATION_REQUEST,
  ACCEPT_INVITATION_SUCCESS,
  GET_RECEIVED_INVITATIONS_REQUEST,
  CANCEL_INVITATION_SUCCESS,
  ACCEPT_INVITATION_REQUEST,
  GET_RECEIVED_INVITATIONS_SUCCESS,
  ACCEPT_INVITATION_FAILURE, GetReceivedInvitationsSuccess,
} from './types';

const initialInvitationsState:InvitationsState = {
  receivedInvitations: [],
  sentInvitations: [],
}

export function invitationsReducer(state= initialInvitationsState, action: KnownInvitationAction ): InvitationsState {
  switch (action.type){
    case GET_RECEIVED_INVITATIONS_FAILURE:
      return {...state};
    case GET_RECEIVED_INVITATIONS_REQUEST:
      return {...state};
    case GET_RECEIVED_INVITATIONS_SUCCESS:
      return {...state, receivedInvitations: action.payload};
    case GET_SENT_INVITATIONS_FAILURE:
      return {...state};
    case GET_SENT_INVITATIONS_REQUEST:
      return {...state};
    case GET_SENT_INVITATIONS_SUCCESS:
      return {...state, sentInvitations: action.payload};
    case CANCEL_INVITATION_REQUEST:
      return {...state};
    case CANCEL_INVITATION_SUCCESS:
      return {...state};
    case CANCEL_INVITATION_FAILURE:
      return {...state};
    case DECLINE_INVITATION_REQUEST:
      return {...state};
    case DECLINE_INVITATION_SUCCESS:
      return {...state};
    case DECLINE_INVITATION_FAILURE:
      return {...state};
    case ACCEPT_INVITATION_FAILURE:
      return {...state};
    case ACCEPT_INVITATION_REQUEST:
      return {...state};
    case ACCEPT_INVITATION_SUCCESS:
      return {...state};
    default:
      return {...state};
  }
}
