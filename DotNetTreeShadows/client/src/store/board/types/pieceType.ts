export enum PieceType {
    Seed,
    SmallTree,
    MediumTree,
    LargeTree
}

export function pieceTypeName(pieceType:PieceType, long?:boolean) {
    switch (pieceType) {
        case PieceType.Seed:
            return "Seed";
        case PieceType.SmallTree:
            return long ? "Small Tree" : "Small";
        case PieceType.MediumTree:
            return long
                   ? "Medium Tree"
                   :"Medium"
        case PieceType.LargeTree:
            return long
                   ? "Large Tree"
                   :"Large"
    }
}
