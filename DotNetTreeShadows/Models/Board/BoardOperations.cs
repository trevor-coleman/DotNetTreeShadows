using System;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;

namespace dotnet_tree_shadows.Models {
  public class BoardOperations {

    public static void PlaceTree (ref Board board, TreeType treeType, Hex origin, SunPosition sunPosition) {
      int tileCode = board.Get(origin);
      tileCode = Tile.SetPieceType(tileCode, PieceType.SmallTree );
      tileCode = Tile.SetTreeType( tileCode, treeType );
      board = CastShadow( board,origin,sunPosition );
      
    }

    public static Board CastShadow (Board board, Hex origin, SunPosition sunPosition) {
      int tileCode = board.Get(origin);
      int height = Tile.GetPieceHeight( tileCode );
      for (int i = 1; i <= height; i++) {
        Hex h = (origin + i * Shadow.Shadow.Direction( sunPosition ));
        if ( board.TryGetValue( h, out int t ) ) {
          board[h] = Tile.GetShadowHeight( t ) < height
                        ? Tile.SetShadowHeight( t, height )
                        : t;
        }
      }

      return board;
    }
    
    public static int CountLight (Board board, TreeType treeType) {
      return board.Tiles.Where( (kvp) => {
                     
                     (_, int value) = kvp;
                     if(Tile.TreeTypeIs( value, treeType ) && Tile.ProducesLight( value )) Console.Write(">>>Counting Light: ");
                     
                     
                     return Tile.TreeTypeIs( value, treeType ) && Tile.ProducesLight( value );
                   } )
               .Aggregate(
                    0,
                    (l, p) => l + Tile.GetLight( p.Value )
                     );
    }
    
    

  }
}
