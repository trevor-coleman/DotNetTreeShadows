using System;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class Tile {
        public HexCoordinates HexCoordinates { get; set; }
        public PieceType? PieceType { get; set; }
        public TreeType? TreeType { get; set; }
        public int ShadowHeight { get; set; }

        public int Light {
            get {
                if ( PieceType == null || TreeType == null) return 0;
                return (int) PieceType > ShadowHeight
                           ? (int) PieceType
                           : 0;
            }
        }

        public bool ProducesLight {
            get => PieceType != null && (int) PieceType > ShadowHeight;
        }

        public Tile () {
            HexCoordinates = new HexCoordinates(0,0,0);
        }
        
        public Tile(HexCoordinates h) {
            HexCoordinates = h;
            PieceType = null;
            TreeType = null;
        }

        public TileDto Dto () =>
            new TileDto {
                            HexCoordinates = HexCoordinates,
                            PieceType = PieceType,
                            TreeType = TreeType,
                            ShadowHeight = ShadowHeight
                        }; 

        public Board.Shadow GetShadow (SunPosition sunPosition) {
            var shadow = new Board.Shadow();
            if ( PieceType == null) return shadow;

            var height = (int) PieceType;
            
            for (int i = 0; i < (int) PieceType; i++) {
                shadow.Add( new Board.ShadowHex( HexCoordinates + (i * ShadowDirection( sunPosition )), height ) );
            }

            return shadow;
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


        public bool CanGrow (bool preventActionsInShadow, out string? failureReasons) {
            if ( PieceType == null ) {
                failureReasons= "Tile is empty. ";
                return false;
            }

            if ( preventActionsInShadow && ShadowHeight > 0 ) {
                failureReasons = "Growth in shadow is disabled in game options.";
                return false;
            }

            if ( PieceType == SessionModels.PieceType.LargeTree ) {
                failureReasons = "Can't grow large tree.";
                return false;
            }

            failureReasons = null;
            return true;

        }
        
        public void GrowTree () {
            PieceType = PieceType switch {
                null => throw new InvalidOperationException( "Can't grow tile with out tree" ),
                SessionModels.PieceType.LargeTree => throw new InvalidOperationException( "Can't grow large tree." ),
                _ => (PieceType) ((int) PieceType + 1)
            };
        }

        public bool HasTree () => PieceType != null;

        public int DistanceFromCenter () => HexCoordinates.DistanceTo( HexCoordinates.Zero );
        public int Leaves () => 4 - DistanceFromCenter();

    }
}
