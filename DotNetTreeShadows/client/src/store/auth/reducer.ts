import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {signIn, registerNewUser} from "./actions";

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
        builder.addCase(signIn.fulfilled, (state, action: PayloadAction<string | null>) => {
                return action.payload == null ? state : {
                    ...state,
                    authInProgress: false,
                    signedIn: true,
                    token: action.payload,
                }
            }
        )
        builder.addCase(signIn.rejected, (state, action) => ({
            ...state,
            authInProgress: false,
            signedIn: false,
            signedInRejectedMessage: action.error.message || "signIn failed"
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
        signOut: (state: AuthState) => {
            return {
                ...state,
                token: null,
                signedIn: false,
            }
        },
        setToken: (state: AuthState, action: PayloadAction<string | null>) => {
            return {
                ...state,
                token: action.payload
            }
        },
    },
    name: "auth",
    initialState: initialState
})


export const {signOut, setToken} = authSlice.actions;
export {signIn, registerNewUser};
export default authSlice.reducer;
