import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {signIn, registerNewUser, registerAndSignIn, signInAndFetchProfile} from "./actions";
import api from "../../api/api";

export interface AuthState {
    authInProgress: boolean,
    signedIn: boolean,
    signedInRejectedMessage: string | null,
}

const initialState: AuthState = {
    authInProgress: false,
    signedIn: false,
    signedInRejectedMessage: null
}

const authSlice = createSlice({
    extraReducers: builder => {
        builder.addCase(signIn.pending, state => ({
            ...state,
            authInProgress: true,
            signedIn: false,
            signedInRejectedMessage: null
        }))
            .addCase(signIn.fulfilled, state => {
                return {
                    ...state,
                    authInProgress: false,
                    signedIn: true
                }}
            )

            .addCase(signIn.rejected, (state, action) => ({
                ...state,
                authInProgress: false,
                signedIn: true,
                signedInRejectedMessage: action.error.toString() || "signIn failed"
            }));

        builder.addCase(registerNewUser.pending, state => ({
            ...state,
            authInProgress: true,
            signedIn: false,
            signedInRejectedMessage: null
        }))
            .addCase(registerNewUser.fulfilled, state => {
                return {
                    ...state,
                    authInProgress: false,
                    signedIn: true
                }}
            )

            .addCase(registerNewUser.rejected, (state, action) => ({
                ...state,
                authInProgress: false,
                signedIn: true,
                signedInRejectedMessage: action.error.toString() || "signIn failed"
            }));
    },
    reducers: {
        signOut() {
            api.signOut()
        }
    },
    name: "board",
    initialState: initialState
})


export const {signOut} = authSlice.actions;
export {signIn, registerNewUser, registerAndSignIn, signInAndFetchProfile};
export default authSlice.reducer;
