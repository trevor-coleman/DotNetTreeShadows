import {createAsyncThunk} from "@reduxjs/toolkit";
import {ExtraInfo} from "../store";
import {Board} from "./types/board";


export const fetchBoard = createAsyncThunk<Board,string,ExtraInfo>(
    'board/fetchBoard',
    async (sessionId, {extra}) => {
        const {api}=extra;
        const response = await api.board.get(sessionId);
        return response.data;
    })
