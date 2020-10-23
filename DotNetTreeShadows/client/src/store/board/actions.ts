import {createAsyncThunk} from "@reduxjs/toolkit";
import {Board} from "./types/board";
import {ExtraInfo} from "../extraInfo";
import {updateTreeTiles} from "./thunks";


export const fetchBoard = createAsyncThunk<Board,string,ExtraInfo>(
    'board/fetchBoard',
    async (sessionId, {extra}) => {
        const {api}=extra;
        const response = await api.board.get(sessionId);
        return response.data;
    })
