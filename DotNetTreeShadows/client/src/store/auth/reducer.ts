import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {signIn, registerNewUser, registerAndSignIn, signInAndFetchProfile} from "./actions";
import {Action} from "typesafe-actions";

export interface AuthState {
    authInProgress: boolean,
    signedIn: boolean,
    signedInRejectedMessage: string | null,
    token: string | null,
}

const initialState: AuthState = {
    authInProgress: false,
    signedIn: false,
    signedInRejectedMessage: null,
    token: null,
}

const authSlice = createSlice({
    extraReducers: builder => {
        builder.addCase(signIn.pending, state => ({
            ...state,
            authInProgress: true,
            signedIn: false,
            signedInRejectedMessage: null
        }));
        builder.addCase(signIn.fulfilled, (state, action: PayloadAction<string | null>) => ({
                ...state,
                authInProgress: false,
                signedIn: true,
                token: action.payload,
            })
        )
        builder.addCase(signIn.rejected, (state, action) => ({
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
                    }
                }
            )

            .addCase(registerNewUser.rejected, (state, action) => ({
                ...state,
                authInProgress: false,
                signedIn: true,
                signedInRejectedMessage: action.error.toString() || "signIn failed"
            }));
    },
    reducers: {
        signOut: (state: AuthState, action: Action) => {
            return {
                ...state,
                token: null
            }
        },
        setToken: (state: AuthState, action: PayloadAction<string | null>) => {
            return {
                ...state,
                token: action.payload
            }
        },
    },
    name: "board",
    initialState: initialState
})


export const {signOut, setToken} = authSlice.actions;
export {signIn, registerNewUser, registerAndSignIn, signInAndFetchProfile};
export default authSlice.reducer;
