import {GameOption} from "../game/types/GameOption";
import {AppDispatch} from "../index";
import {sendDisconnectFromSession} from "./actions";
import { setConnectedSession } from "./reducer";

export const disconnectFromSession = (sessionId:string) => async (dispatch: AppDispatch) => {
  await dispatch(sendDisconnectFromSession(sessionId));
  await dispatch(setConnectedSession(null));
}
