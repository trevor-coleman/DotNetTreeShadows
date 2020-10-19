using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;

namespace dotnet_tree_shadows.Models.Shadow {
  public static class Shadow {

    public static Hex ShadowDirection (SunPosition sunPosition) {
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

    public static Dictionary<Hex, int> GetShadows (Board board, SunPosition sunPosition) {
      Dictionary<Hex, int> shadows = new Dictionary<Hex, int>();

      IEnumerable<KeyValuePair<Hex, int>>? treeTiles = board.Tiles.Where( kvp => Tile.HasTree( kvp.Value ) );

      foreach ( (Hex h, int t) in treeTiles ) {
        int height = Tile.GetPieceHeight( t );
        for (int i = 0; i < height; i++) {
          Hex hShadow = h + (i * ShadowDirection( sunPosition ));
          shadows[hShadow] = shadows.TryGetValue( hShadow, out int tileHeight )
                               ? Math.Max( height, tileHeight )
                               : height;
        }
      }
      return shadows;
    }

    public static Dictionary<Hex, int> CastShadow (in Board board, in Hex hex, in int tileCode, in SunPosition sunPosition) {
      Dictionary<Hex, int> result = new Dictionary<Hex, int>( board.Tiles );
      int height = Tile.GetPieceHeight( tileCode );
      for (int i = 0; i < height; i++) {
        Hex h = (hex + i * ShadowDirection( sunPosition ));
        if ( result.TryGetValue( h, out int t ) ) {
          result[h] = Tile.GetShadowHeight( t ) < height
                        ? height
                        : t;
        }
      }
      return result;
    }
    
    public static Dictionary<Hex, int> UpdateAllShadows (Board board, SunPosition sunPos) {
      Dictionary<Hex, int> shadows = GetShadows( board, sunPos );
      return board.Tiles.Select(
                       kvp => {
                         (Hex h, int t) = kvp;

                         int newTile = shadows.TryGetValue( h, out int shadowHeight )
                                         ? Tile.SetShadowHeight( t, shadowHeight )
                                         : Tile.SetShadowHeight( t, 0 );

                         return new KeyValuePair<Hex, int>( h, newTile );
                       }
                     )
                  .ToDictionary( kvp => kvp.Key, kvp => kvp.Value );
    }

  }
}
