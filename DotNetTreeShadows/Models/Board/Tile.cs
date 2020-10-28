using System;
using dotnet_tree_shadows.Models.Enums;

namespace dotnet_tree_shadows.Models {
  public class Tile {

    public static int GetShadowHeight (in int tileCode) => tileCode >> 6 & 3;

    public static int SetShadowHeight (in int tileCode, int shadowHeight) {
      if ( GetTileType( tileCode ) == TileType.Sky ) return tileCode;
      int result = tileCode & ~(3 << 6);
      result |= shadowHeight << 6;
      return result;
    }

    public static int SetShadowHeight (in int tileCode, PieceType pieceType) =>
      SetShadowHeight( tileCode, (int) pieceType );

    private static int GetTileTypeCode (in int tileCode) => (tileCode >> 4) & 3;
    private static int GetPieceTypeCode (in int tileCode) => tileCode & 3;
    private static int GetTreeTypeCode (in int tileCode) => (tileCode >> 2) & 3;

    public static int GetPieceHeight (in int tileCode) =>
      GetTileType( tileCode ) != TileType.Piece
        ? 0
        : GetPieceTypeCode( tileCode );

    public static PieceType? GetPieceType (in int tileCode) =>
      GetTileType( tileCode ) != TileType.Piece
        ? null
        : (PieceType?) GetPieceTypeCode( tileCode );

    public static TreeType? GetTreeType (in int tileCode) =>
      GetTileType( tileCode ) != TileType.Piece
        ? null
        : (TreeType?) GetTreeTypeCode( tileCode );

    private static TileType GetTileType (in int tileCode) => (TileType) GetTileTypeCode( tileCode );

    private static int SetTileType (in int tileCode, in TileType tileType) {
      int result = tileCode & ~(3 << 4);
      result |= (int) tileType << 4;
      return result;
    }

    public static int SetPieceType (in int tileCode, in PieceType? pieceType) {
      int result = tileCode;
      if ( pieceType == null ) return SetTileType( result, TileType.Empty );
      result = SetTileType( result, TileType.Piece );
      result &= ~3;
      result |= (int) pieceType;
      return result;
    }

    public static int SetTreeType (in int tileCode, in TreeType? treeType) {
      int result = tileCode;
      if ( treeType == null ) return SetTileType( result, TileType.Empty );
      result = SetTileType( result, TileType.Piece );
      result &= ~(3 << 2);
      result |= (int) treeType << 2;
      return result;
    }

    public static bool TreeTypeIs (in int tileCode, in TreeType treeType) => GetTreeType( tileCode ) == treeType;

    public static int GetLight (in int tileCode) {
      if ( GetTileType( tileCode ) == TileType.Empty || GetTileType( tileCode ) == TileType.Sky ) return 0;
      int pieceHeight = GetPieceHeight( tileCode );
      return pieceHeight > GetShadowHeight( tileCode )
               ? pieceHeight
               : 0;
    }

    public static int Sky {
      get => (int) TileType.Sky << 6;
    }

    public static int Empty {
      get => 0;
    }

    public static bool HasTree (int tileCode) =>
      GetTileType( tileCode ) != TileType.Empty && GetPieceTypeCode( tileCode ) > 0;

    public static bool IsShadowed (in int tileCode) =>
      GetTileType( tileCode ) != TileType.Sky &&
      (GetShadowHeight( tileCode ) == 0 || GetPieceTypeCode( tileCode ) > GetShadowHeight( tileCode ));

    public static bool ProducesLight (in int tileCode) => GetPieceHeight( tileCode ) > GetShadowHeight( tileCode );

    private enum TileType {

      Empty,
      Piece,
      Sky

    }

    public static int Create (PieceType pieceType, TreeType treeType) {
      int newTile = Empty;
      newTile = SetPieceType( newTile, pieceType );
      newTile = SetTreeType( newTile, treeType );
      return newTile;
    }

  }
}
