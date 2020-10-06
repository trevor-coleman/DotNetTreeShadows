import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchGame = createAsyncThunk(
    'board/fetchBoard',
    async (sessionId:string)=>{
        const response = await api.getGame(sessionId);
        return response.data;
    })
