import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Tile} from "./types/tile";
import {fetchBoard} from "./actions";
import {TreeType} from "./types/treeType";
import {PieceType} from "./types/pieceType";
import {Board} from "./types/board";
import { updateSession } from "../session/reducer";
import {SessionUpdate} from "../session/types";

const stateWithTileAtH = (state: BoardState, tile: number, h: number): BoardState => ({
    ...state,
    tiles: {
        ...state.tiles,
        [h]: tile
    }
})


export interface BoardState extends Board{
    loadingBoard: boolean;
    loadingBoardRejectedMessage: string | null;
    displayTiles: {[hex: number]: number}
}

const boardSlice = createSlice({
    extraReducers: builder => {
        builder.addCase(fetchBoard.pending, (state) => ({
            ...state,
            loadingBoardFailedMessage: null,
            loadingTiles: false
        }));

        builder.addCase(fetchBoard.rejected, (state, action) => ({
            ...state,
            loadingBoardRejectedMessage: action.error.toString() || "Loading Board Failed",
            loadingTiles: false
        }));

        builder.addCase(fetchBoard.fulfilled, (state, action) =>
            ({
                ...state,
                loadingBoardRejectedMessage: null,
                loadingTiles: false,
            }));
        builder.addCase(updateSession, (state, action:PayloadAction<SessionUpdate>)=>({
        ...state,
            ...action.payload.board
        }))
    },
    reducers: {
        addPieceToHex: (state, action: PayloadAction<{ hexCode: number, pieceType: PieceType, treeType: TreeType }>) => {
            const {hexCode, pieceType, treeType} = action.payload;
            let tile: number = state.tiles[hexCode];
            console.log("addPiece", hexCode, tile)
            tile = Tile.SetPieceType(tile, pieceType);
            tile = Tile.SetTreeType(tile, treeType);
            return stateWithTileAtH(state, tile, hexCode);

        },
        removePieceFromHex: (state, action: PayloadAction<{ hexCode: number }>) => {
            const {hexCode} = action.payload;
            let tile: number = state.tiles[hexCode];
            tile = Tile.SetPieceType(tile, null);
            return stateWithTileAtH(state, tile, hexCode);
        },
        updateTiles: (state, action :PayloadAction<Board>)=> ({
            ...state,
            ...action.payload
        })

    },
    name: "board",
    initialState: {} as BoardState
})


export const {addPieceToHex, removePieceFromHex} = boardSlice.actions;
export {fetchBoard};
export default boardSlice.reducer;
