import {AppDispatch} from "../index";
import {fetchProfile} from "../profile/actions";
import {fetchInvitations, sendFriendRequest, updateInvitationStatus} from "./actions";
import {Invitation, InvitationStatus} from "./types/invitation";

export const addFriend = (friendInfo: string) => async (dispatch: AppDispatch) => {
  await dispatch(sendFriendRequest(friendInfo));
  await dispatch(fetchProfile());
  await dispatch(fetchInvitations());
};

export const updateInvitation = (invitation: Invitation, status: InvitationStatus) => async (dispatch: AppDispatch) => {
  try {
    await dispatch(updateInvitationStatus({
      invitation,
      status
    }));
    await dispatch(fetchProfile())
    await dispatch(fetchInvitations())
  } catch (e) {

  }
};
