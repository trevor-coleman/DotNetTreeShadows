import {TreeType} from "../../board/types/treeType";
import {PieceType} from "../../board/types/pieceType";

interface PieceCount {
    available: number;
    onPlayerBoard: number;
    max: number;
    increaseAvailable: () => number;
    decreaseAvailable: () => number;
    increaseOnPlayerBoard: () => number;
    decreaseOnPlayerBoard: () => number;
}


export default class PlayerBoard {
    public static GetLight = (boardCode: number): number => {
        return (boardCode >> 2) & 63;
    }

    public static TreeType = (boardCode: number): TreeType => boardCode & 3 as TreeType;

    public static seeds = (boardCode: number): PieceCount => PlayerBoard.DecodePieceCounts(boardCode, [8, 15], [12, 7], 4)
    public static smallTrees = (boardCode: number): PieceCount => PlayerBoard.DecodePieceCounts(boardCode, [15, 15], [19, 7], 4)
    public static mediumTrees = (boardCode: number): PieceCount => PlayerBoard.DecodePieceCounts(boardCode, [22, 7], [25, 7], 3)
    public static largeTrees = (boardCode: number): PieceCount => PlayerBoard.DecodePieceCounts(boardCode, [28, 3], [30, 3], 2)

    public static GetPieces = (boardCode: number, pieceType: PieceType): PieceCount => {
        switch (pieceType) {
            case PieceType.Seed:
                return PlayerBoard.seeds(boardCode);
            case PieceType.SmallTree:
                return PlayerBoard.smallTrees(boardCode);
            case PieceType.MediumTree:
                return PlayerBoard.mediumTrees(boardCode);
            case PieceType.LargeTree:
                return PlayerBoard.largeTrees(boardCode);
        }
        throw new Error(`Invalid pieceType: ${pieceType} - ${PieceType[pieceType]} `)
    }

    public static spaces = (pieceType: PieceType) => {
        switch (pieceType) {
            case PieceType.Seed:
                return 4;
            case PieceType.SmallTree:
                return 4;
            case PieceType.MediumTree:
                return 3;
            case PieceType.LargeTree:
                return 2;
        }
    }

    public static prices = (pieceType: PieceType): number[] => {
        switch (pieceType) {
            case PieceType.Seed:
                return [2, 2, 1, 1];
            case PieceType.SmallTree:
                return [3, 3, 2, 2];
            case PieceType.MediumTree:
                return [4, 3, 3];
            case PieceType.LargeTree:
                return [5, 4];
        }
    };

    public static MakeGrid = (boardCode: number) => {
        const pieceTypes: PieceType[] = [PieceType.Seed, PieceType.SmallTree, PieceType.MediumTree, PieceType.LargeTree];
        const grid: PieceDetails[][] = [];
        pieceTypes.forEach(pt => {
            const column: PieceDetails[] = [];
            const spaces = PlayerBoard.spaces(pt);
            const onPlayerBoard = PlayerBoard.GetPieces(boardCode, pt).onPlayerBoard;
            for (let i = 0; i < spaces; i++) {
                const status = i <= onPlayerBoard - 1
                        ? "Filled"
                        : "Empty";
                column.push({
                    status: status,
                    price: PlayerBoard.prices(pt)[i].toString() ?? "",
                    key: PieceType[pt]+i
                });
            }

            grid.push(column);

        });
        return grid;
    }

    public static lowestPrice = (boardCode: number):number => {
        const pieceTypes: PieceType[] = [PieceType.Seed, PieceType.SmallTree, PieceType.MediumTree, PieceType.LargeTree];
        let lowestPrice = Number.POSITIVE_INFINITY;
        pieceTypes.forEach((pt)=>{
        let currentPrice = PlayerBoard.currentPrice(boardCode, pt);
        lowestPrice = Math.min(lowestPrice,currentPrice);}
        )
        return lowestPrice;
    }

    private static DecodePieceCounts = (boardCode: number, available: number[], onPlayerBoard: number[], max:number) => ({
        available: (boardCode >> available[0]) & available[1],
        onPlayerBoard: (boardCode >> onPlayerBoard[0]) & onPlayerBoard[1],
        max,
        increaseAvailable: () => {
            let currentlyAvailable = (boardCode >> available[0]) & available[1];
            let result = boardCode & (~(available[1] << available[0]));
            result |= (currentlyAvailable + 1) << available[0];
            return result;
        },
        decreaseAvailable: () => {
            let result = boardCode & (~(available[1] << available[0]));
            let currentlyAvailable = (boardCode >> available[0]) & available[1];
            result |= (currentlyAvailable - 1) << available[0];
            return result;
        },
        increaseOnPlayerBoard: () => {
            let currentlyOnPlayerBoard = (boardCode >> onPlayerBoard[0]) & 7;
            let result = boardCode & (~(onPlayerBoard[1] << onPlayerBoard[0]));
            result |= (Math.min(currentlyOnPlayerBoard + 1, max)) << onPlayerBoard[0];
            return result;
        },
        decreaseOnPlayerBoard: () => {
            let result = boardCode & (~(onPlayerBoard[1] << onPlayerBoard[0]));
            let currentlyOnPlayerBoard = (boardCode >> onPlayerBoard[0]) & 7;
            result |= (currentlyOnPlayerBoard - 1) << onPlayerBoard[0];
            return result;
        }
    })

    public static available(boardCode: number):number[] {
        return [PlayerBoard.seeds(boardCode).available,
            PlayerBoard.smallTrees(boardCode).available,
             PlayerBoard.mediumTrees(boardCode).available,
             PlayerBoard.largeTrees(boardCode).available,
        ]
    }

    static currentPrice(boardCode: number, pieceType: PieceType) {
        const onPlayerBoard = PlayerBoard.GetPieces(boardCode, pieceType).onPlayerBoard;
        return onPlayerBoard == 0 ? 0 : PlayerBoard.prices(pieceType)[onPlayerBoard-1];
    }

}

export type PieceDetails = { status: "Ready" | "Filled" | "Empty", price: string, key:string }
