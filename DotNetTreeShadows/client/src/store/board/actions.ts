import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchBoard = createAsyncThunk(
    'board/fetchBoard',
    async (sessionId:string)=>{
        const response = await api.board.get(sessionId);
        return response.data;
    })
