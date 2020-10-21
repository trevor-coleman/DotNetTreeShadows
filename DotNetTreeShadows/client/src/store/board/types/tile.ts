import {TreeType} from "./treeType";
import {PieceType} from "./pieceType";

enum TileType {

  Empty,
  Piece,
  Sky

}


export class Tile {

  public static Sky: number = TileType.Sky << 6;
  public static Empty = 0;

  public static GetShadowHeight = (tileCode: number): number => (tileCode >> 6) & 3;

  public static SetShadowHeight = (tileCode: number, shadowHeight: number): number => {
    if (Tile.GetTileType(tileCode) === TileType.Sky) return tileCode;
    let result: number = tileCode & ~(3 << 6);
    result |= shadowHeight << 6;
    return result;
  }

  public static GetPieceHeight = (tileCode: number) => Tile.GetTileType(tileCode) !== TileType.Piece
    ? 0
    : Tile.GetPieceTypeCode(tileCode);

  public static GetPieceType = (tileCode: number): PieceType | null =>
    Tile.GetTileType(tileCode) !== TileType.Piece
      ? null
      : Tile.GetPieceTypeCode(tileCode) as PieceType;

  public static GetTreeType = (tileCode: number): TreeType | null => Tile.GetTileType(tileCode) !== TileType.Piece
    ? null
    : Tile.GetTreeTypeCode(tileCode) as TreeType;

  static GetTileType = (tileCode: number): TileType => Tile.GetTileTypeCode(tileCode) as TileType;

  public static SetPieceType(tileCode: number, pieceType: PieceType | null) {
    let result: number = tileCode;
    if (pieceType === null) return Tile.SetTileType(result, TileType.Empty);
    result = Tile.SetTileType(result, TileType.Piece);
    result &= ~(3 << 2);
    result |= pieceType << 2;
    return result;
  }

  public static SetTreeType(tileCode: number, treeType: TreeType | null) {
    let result: number = tileCode;
    if (treeType === null) return Tile.SetTileType(result, TileType.Empty);
    result = Tile.SetTileType(result, TileType.Piece);
    result &= ~3;
    result |= treeType;
    return result;
  }

  public static TreeTypeIs = (tileCode: number, treeType: TreeType): boolean => {
    return Tile.GetTreeType(tileCode) === treeType;
  }

  public static GetLight = (tileCode: number): number => {
    if (Tile.GetTileType(tileCode) === TileType.Empty || Tile.GetTileType(tileCode) === TileType.Sky) return 0;
    let pieceTypeValue = Tile.GetPieceTypeCode(tileCode);
    return pieceTypeValue > Tile.GetShadowHeight(tileCode)
      ? pieceTypeValue
      : 0;
  }

  public static HasTree = (tileCode: number) => Tile.GetTileType(tileCode) !== TileType.Empty && Tile.GetPieceTypeCode(tileCode) > 0;

  public static IsShadowed = (tileCode: number): boolean =>
    Tile.GetTileType(tileCode) !== TileType.Sky &&
    (Tile.GetShadowHeight(tileCode) === 0 || Tile.GetPieceTypeCode(tileCode) > Tile.GetShadowHeight(tileCode));

  public static ProducesLight = (tileCode: number): boolean =>
    Tile.GetTileType(tileCode) === TileType.Piece && Tile.GetPieceTypeCode(tileCode) > Tile.GetShadowHeight(tileCode);

  public static Create = (pieceType: PieceType, treeType: TreeType): number => {
    let newTile: number = Tile.Empty;
    newTile = Tile.SetPieceType(newTile, pieceType);
    newTile = Tile.SetTreeType(newTile, treeType);
    return newTile;
  }

  static Details = (tileCode: number): { treeType: TreeType | null, pieceType: PieceType | null, shadowHeight: number, isSky: boolean } => {
    return ({
      treeType: Tile.GetTreeType(tileCode),
      pieceType: Tile.GetPieceType(tileCode),
      shadowHeight: Tile.GetShadowHeight(tileCode),
      isSky: Tile.GetTileType(tileCode) === TileType.Sky
    })
  }

  public static IsEmpty(tileCode: number) {
    return this.GetPieceType(tileCode) === null;
  }

  private static GetTileTypeCode = (tileCode: number) => (tileCode >> 4) & 3;

  private static GetPieceTypeCode = (tileCode: number) => tileCode & 3;

  private static GetTreeTypeCode = (tileCode: number) => (tileCode >> 2) & 3;

  private static SetTileType = (tileCode: number, tileType: TileType) => {
    let result: number = tileCode & ~(3 << 4);
    result |= tileType << 4;
    return result;
  }
}

export default Tile;

