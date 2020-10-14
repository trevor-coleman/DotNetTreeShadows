import {AppDispatch} from "../index";
import {fetchProfile, removeFriendFromProfile} from "./actions";

export const removeFriend = (id: string) => async (dispatch: AppDispatch) => {
  await dispatch(removeFriendFromProfile(id));
  await dispatch(fetchProfile());
};
