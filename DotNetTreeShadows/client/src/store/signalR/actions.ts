import gameHub from "../../gamehub";
import enhancedStore from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../index";
import { GameOption } from "../game/types/GameOption";
import { gameOptionUpdate } from "../game/reducer";
import { GameHubMethod } from "../../gamehub/methods";
import { Invitation } from "../invitations/types/invitation";
import { ExtraInfo } from "../extraInfo";

const { store } = enhancedStore;

export const connectToSession = createAsyncThunk<void, string>(
  "gamehub/connectToSession",
  async (sessionId, thunkAPI) => {
    try {
      await gameHub.send(GameHubMethod.ConnectToSession, {
        sessionId,
        playerId: store.getState().profile.id
      });
      return;
    } catch (e) {
      console.error(e);
      thunkAPI.rejectWithValue(e.message ?? "connect to session failed");
    }
  }
);

export const sendDisconnectFromSession = createAsyncThunk<void, string>(
  "gamehub/disconnectFromSession",
  async (sessionId, thunkApi) => {
    try {
      await gameHub.send(GameHubMethod.DisconnectFromSession, sessionId);
      return;
    } catch (e) {
      thunkApi.rejectWithValue(e.message ?? "disconnect failed");
    }
  }
);

export const setGameOption = (
  gameOption: GameOption,
  value: boolean,
  sessionId: string
) => async (dispatch: AppDispatch) => {
  const newGameOptions = {
    ...store.getState().game.gameOptions,
    [gameOption]: value ? value : undefined
  };
  dispatch(gameOptionUpdate(newGameOptions));
  await dispatch(
    sendGameOptionUpdate({
      gameOption,
      value,
      sessionId
    })
  );

};

export const cancelSessionInvite = (invitation: Invitation) => async (
  dispatch: AppDispatch
) => {
  await dispatch(cancelSessionInviteAsync(invitation));
};

const cancelSessionInviteAsync = createAsyncThunk<void, Invitation, ExtraInfo>(
  "gamehub/cancelSessionInvite",
  async (invitation, thunkAPI) => {
    const result = await gameHub.send(
      GameHubMethod.CancelSessionInvite,
      invitation
    );
    return result;
  }
);

export const sendGameOptionUpdate = createAsyncThunk<
  void,
  { gameOption: string; value: boolean; sessionId: string }
>("gamehub/sendGameOptionsUpdate", async request => {
  try {
    await gameHub.send(GameHubMethod.SetGameOption, request);
    return;
  } catch (e) {
    console.error(e.message);
    return e.message ?? "failed to update option";
  }
});
