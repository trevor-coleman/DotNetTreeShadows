import {createAsyncThunk} from "@reduxjs/toolkit";
import {SignInCredentials} from "../../types/auth/signInCredentials";
import api from "../../api/api";

export const signIn = createAsyncThunk("auth/signIn",
    async (credentials:SignInCredentials)=> {
    const response = await api.signIn(credentials)
    })
