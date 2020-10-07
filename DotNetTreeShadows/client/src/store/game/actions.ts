import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchGame = createAsyncThunk(
    'game/fetchGame',
    async (sessionId:string)=>{
        const response = await api.game.getGame(sessionId);
        return response.data;
    })
