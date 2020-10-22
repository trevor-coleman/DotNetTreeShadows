using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;

namespace dotnet_tree_shadows.Models.Shadow {
  public static class Shadow {

    public static Hex Direction (SunPosition sunPosition) {
      return sunPosition switch {
        SunPosition.NorthWest => new Hex( 0, +1, -1 ),
        SunPosition.NorthEast => new Hex( -1, +1, 0 ),
        SunPosition.East => new Hex( -1, 0, +1 ),
        SunPosition.SouthEast => new Hex( 0, -1, +1 ),
        SunPosition.SouthWest => new Hex( +1, -1, 0 ),
        SunPosition.West => new Hex( +1, 0, -1 ),
        _ => throw new ArgumentOutOfRangeException( nameof(sunPosition), sunPosition, null )
      };
    }

    public static TileDictionary GetShadows (Board board, SunPosition sunPosition) {
      TileDictionary shadows = new TileDictionary();

      IEnumerable<KeyValuePair<Hex, int>>? treeTiles = board.Tiles.Where( kvp => Tile.HasTree( kvp.Value ) );

      foreach ( (Hex hex, int tileCode) in treeTiles ) {
        int height = Tile.GetPieceHeight( tileCode );
        for (int i = 1; i <= height; i++) {
          Hex hShadow = hex + (i * Direction( sunPosition ));
          shadows[hShadow] = shadows.TryGetValue( hShadow, out int tileHeight )
                               ? Math.Max( height, tileHeight )
                               : height;
        }
      }
      return shadows;
    }

    public static TileDictionary CastShadow (in Board board, in Hex hex, in int tileCode, in SunPosition sunPosition) {
      TileDictionary result = new TileDictionary( board.Tiles );
      int height = Tile.GetPieceHeight( tileCode );
      for (int i = 1; i <= height; i++) {
        Hex h = (hex + i * Direction( sunPosition ));
        if ( result.TryGetValue( h, out int t ) ) {
          result[h] = Tile.GetShadowHeight( t ) < height
                        ? height
                        : t;
        }
      }
      return result;
    }
    
    public static TileDictionary UpdateAllShadows (Board board, SunPosition sunPos) {
      TileDictionary shadows = GetShadows( board, sunPos );
      return new TileDictionary(board.Tiles.Select(
                       kvp => {
                         (Hex hex, int tileCode) = kvp;
                         int newTile = shadows.TryGetValue( hex, out int shadowHeight )
                                         ? Tile.SetShadowHeight( tileCode, shadowHeight )
                                         : Tile.SetShadowHeight( tileCode, 0 );
                         return new KeyValuePair<Hex, int>( hex, newTile );
                       }
                     )
                  .ToDictionary( kvp => kvp.Key, kvp => kvp.Value ));
 }

  }
}
