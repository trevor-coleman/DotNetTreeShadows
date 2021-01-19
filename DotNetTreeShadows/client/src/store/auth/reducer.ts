import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signIn, registerNewUser, checkIfUsernameExists } from "./actions";
import { useTypedSelector } from "../index";
import { AuthApiResult } from "../../api/authApiSection";
import { act } from "react-dom/test-utils";

export interface AuthState {
  authInProgress: boolean;
  signedIn: boolean;
  signInRejectedMessage: string | null;
  registerRejectedMessage: string | null;
  token: string | null;
  checkIfDuplicateUsername: string | null,
  checkIfDuplicateRequestId: string | null,
  checkIfDuplicatePending: boolean,
  checkIfDuplicateResult: boolean,
  checkIfDuplicateMessage: string,
}

const initialState: AuthState = {
  authInProgress: false,
  signedIn: false,
  signInRejectedMessage: null,
  registerRejectedMessage: null,
  token: null,
  checkIfDuplicateUsername:  null,
  checkIfDuplicateRequestId:  null,
  checkIfDuplicatePending: false,
  checkIfDuplicateResult: false,
  checkIfDuplicateMessage: "",
};

const authSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(signIn.pending, state => ({
      ...state,
      authInProgress: true,
      signedIn: false,
      signedInRejectedMessage: null
    }));
    builder.addCase(
      signIn.fulfilled,
      (state, action: PayloadAction<AuthApiResult>) => {
        const { success, token, message } = action.payload;
        return action.payload == null
          ? state
          : {
              ...state,
              authInProgress: false,
              signedIn: success,
              token: token || "",
              signInRejectedMessage: !success ? message : ""
            };
      }
    );
    builder.addCase(signIn.rejected, (state, action) => ({
      ...state,
      authInProgress: false,
      signedIn: false,
      signedInRejectedMessage: action.error.message || "Error while signing in."
    }));

    builder.addCase(registerNewUser.pending, state => {
      return {
        ...state,
        authInProgress: true,
        signedIn: false,
        signedInRejectedMessage: null
      };
    });

    builder.addCase(
      registerNewUser.fulfilled,
      (state, action: PayloadAction<AuthApiResult>) => {
        const { success, message, token } = action.payload;
        return {
          ...state,
          authInProgress: false,
          signedIn: success,
          token: token || "",
          registerRejectedMessage: !success ? message : ""
        };
      }
    );

    builder.addCase(registerNewUser.rejected, (state, action) => ({
      ...state,
      authInProgress: false,
      signedIn: true,
      registerRejectedMessage:
        action.error.toString() ||
        "Server Error while registering. Please refresh and try again."
    }));

    builder.addCase(checkIfUsernameExists.pending, (state,action)=> {
      const {username, id} = action.meta.arg
      return (
          {
            ...state,
            checkIfDuplicatePending: true,
            checkIfDuplicateUsername: username,
            checkIfDuplicateRequestId: id,
            checkIfDuplicateResult: false,
            checkIfDuplicateMessage: "Checking if username is available",
          });
    });

    builder.addCase(checkIfUsernameExists.fulfilled, (state, action) => {
      const {
        username,
        id,
          isDuplicate,
          success,
      } = action.payload

      if(state.checkIfDuplicateRequestId !== id || state.checkIfDuplicateUsername !== username) return state;

      let checkIfDuplicateMessage:string = "Couldn't check for duplicates."
      if(success) {
        checkIfDuplicateMessage = isDuplicate ? "Username already in use.": "Username is available";
      }



      return (
          {
            ...state,
            checkIfDuplicatePending: false,
            checkIfDuplicateUsername: null,
            checkIfDuplicateRequestId: null,
            checkIfDuplicateResult: isDuplicate || false,
            checkIfDuplicateMessage
          });
    });

    builder.addCase(checkIfUsernameExists.rejected, (state, action) => {
      const {
        username,
        id,
      } = action.meta.arg

      if (state.checkIfDuplicateRequestId !== id) return state;
      return (
          {
            ...state,
            checkIfDuplicatePending: false,
            checkIfDuplicateUsername: null,
            checkIfDuplicateRequestId: null,
            checkIfDuplicateResult: false,
            checkIfDuplicateMessage: "Couldn't check for duplicates."
          });
    });

  },
  reducers: {
    signOut: (state: AuthState) => {
      return {
        ...state,
        token: null,
        signedIn: false
      };
    },
    setToken: (state: AuthState, action: PayloadAction<string | null>) => {
      return {
        ...state,
        token: action.payload
      };
    }
  },
  name: "auth",
  initialState: initialState
});

export const useSignedIn = () => useTypedSelector(state => state.auth.signedIn);

export const { signOut, setToken } = authSlice.actions;
export { signIn, registerNewUser };
export default authSlice.reducer;
