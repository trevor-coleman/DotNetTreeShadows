import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Tile} from "./tile";
import {fetchBoard} from "./actions";
import {TreeType} from "./treeType";
import {PieceType} from "./pieceType";

const stateWithTileAtH = (state: BoardState, tile: number, h: number): BoardState => ({
    ...state,
    tiles: {
        ...state.tiles,
        [h]: tile
    }
})


export type BoardState = {
    loadingBoard: boolean;
    loadingBoardRejectedMessage: string | null;
    tiles: { [hex: number]: number };
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
                tiles: {...action.payload.tiles}
            }));
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

    },
    name: "board",
    initialState: {} as BoardState
})


export const {addPieceToHex, removePieceFromHex} = boardSlice.actions;
export {fetchBoard};
export default boardSlice.reducer;
