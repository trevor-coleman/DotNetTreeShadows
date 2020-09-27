import {
  getSentInvitations,
  getReceivedInvitations,
  acceptInvitation,
  declineInvitation, cancelInvitation,
} from './actions';
import { AppThunk } from '../middleware/thunks';
import { Invitation, InvitationStatus } from './types';
import axios, { AxiosResponse } from 'axios';

export const getAllInvitationsAsync = () => {
  getInvitationsAsync("sent");
  getInvitationsAsync("received");
}

export const getInvitationsAsync = (type: "sent" | "received"): AppThunk => async (dispatch, getState) => {
  let asyncAction;
  switch (type){
    case 'sent':
      asyncAction = getSentInvitations;
      break;
    case 'received':
      asyncAction = getReceivedInvitations;
      break;
  }

  dispatch(asyncAction.request());
  try {
    const asyncResp: AxiosResponse = await axios.get(`profiles/me/invitations/${type}`,
      {
        baseURL: "https://localhost:5001/api/",
        headers: {Authorization: `Bearer ${getState().system.token}`},
      });
    const invitations = await asyncResp.data as Invitation[];
    dispatch(asyncAction.success(invitations));
  } catch (e) {
    console.log(e?.response?.data?.message ?? e.statusMessage)
    dispatch(asyncAction.failure(e?.response?.data?.message ?? e.statusMessage));
  }
};

export const getSentInvitationsAsync = (): AppThunk => getInvitationsAsync("sent");
export const getReceivedInvitationsAsync = (): AppThunk => getInvitationsAsync("received");

export const updateInvitationStatusAsync = (invitation:Invitation, status:InvitationStatus ): AppThunk => async (dispatch, getState) => {

  let asyncAction;
  switch (status){
    case 'Accepted':
      asyncAction = acceptInvitation;
      break;
    case 'Declined':
      asyncAction = declineInvitation;
      break;
    case 'Cancelled':
      asyncAction =  cancelInvitation;
      break;
    default:
      throw new Error("Invalid Invitation Status");
  }

  dispatch(asyncAction.request(invitation));
  try {
    await axios.post(`/invitations/${invitation.id}/status`, {invitationStatus: status},
      {
        baseURL: "https://localhost:5001/api/",
        headers: {Authorization: `Bearer ${getState().system.token}`},
      });
    dispatch(asyncAction.success());
    dispatch(getSentInvitationsAsync());
    dispatch(getReceivedInvitationsAsync());
  } catch (e) {

    dispatch(asyncAction.failure(e?.response?.data?.message ?? e.statusMessage ));
  }
};

export const acceptInvitationAsync = (invitation:Invitation): AppThunk => updateInvitationStatusAsync(invitation, 'Accepted');
export const declineInvitationAsync = (invitation:Invitation): AppThunk => updateInvitationStatusAsync(invitation, 'Declined');
export const cancelInvitationAsync = (invitation:Invitation): AppThunk => updateInvitationStatusAsync(invitation, 'Cancelled');



