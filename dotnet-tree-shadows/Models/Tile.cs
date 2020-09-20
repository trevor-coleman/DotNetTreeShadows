using System;

namespace dotnet_tree_shadows.Models {
    public class Tile {
        public HexCoordinates HexCoordinates { get; set; }
        public PieceType? PieceType { get; set; }
        public TreeType? TreeType { get; set; }
        public int ShadowHeight { get; set; }
        
        
        public Tile () {
            HexCoordinates = new HexCoordinates(0,0,0);
        }
        
        public Tile(HexCoordinates h) {
            HexCoordinates = h;
            PieceType = null;
            TreeType = null;
        }

        public HexCoordinates[] Shadow (SunPosition sunPosition) {
            if ( PieceType == null) return new HexCoordinates[0];

            int height = (int) PieceType;
            
            HexCoordinates[] shadowedTiles = new HexCoordinates[height];

            for (int i = 0; i < (int) PieceType; i++) {
                shadowedTiles[i] = HexCoordinates + (i * ShadowDirection(sunPosition));
            }

            return shadowedTiles;
        }

        public static HexCoordinates ShadowDirection (SunPosition sunPosition) {
            return sunPosition switch {
                SunPosition.NorthWest => new HexCoordinates( 0, +1, -1 ),
                SunPosition.NorthEast => new HexCoordinates( -1, +1, 0 ),
                SunPosition.East => new HexCoordinates( -1, 0, +1 ),
                SunPosition.SouthEast => new HexCoordinates( 0, -1, +1 ),
                SunPosition.SouthWest => new HexCoordinates( +1, -1, 0 ),
                SunPosition.West => new HexCoordinates( +1, 0, -1 ),
                _ => throw new ArgumentOutOfRangeException( nameof(sunPosition), sunPosition, null )
            };
        }
        
        public override string ToString () => $"[Tile - {HexCoordinates.ToString()}]";

        public bool IsShaded () =>
            PieceType == null
                ? ShadowHeight > 0
                : (int) PieceType > ShadowHeight;
    }
}
