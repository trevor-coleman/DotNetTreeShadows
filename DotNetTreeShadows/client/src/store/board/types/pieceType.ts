export enum PieceType {
    Seed,
    SmallTree,
    MediumTree,
    LargeTree
}

export function pieceTypeName(pieceType:PieceType) {
    switch (pieceType) {
        case PieceType.Seed:
            return "Seed";
        case PieceType.SmallTree:
            return "Small Tree"
        case PieceType.MediumTree:
            return "Medium Tree"
        case PieceType.LargeTree:
            return "Large Tree"
    }
}
