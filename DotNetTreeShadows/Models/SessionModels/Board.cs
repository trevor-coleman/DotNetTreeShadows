using System;
using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class Board {
        
        public List<HexCoordinates> TreeTiles { get; set; } = new List<HexCoordinates>();
        public readonly Dictionary<HexCoordinates, uint> Tiles = new Dictionary<HexCoordinates, uint>();
        public SunPosition SunPosition = SunPosition.NorthEast;
        
        public static Board New (int radius = 4) {
            Board board = new Board();
            for (int q = -radius; q <= radius; q++) {
                int r1 = Math.Max( -radius, -q - radius );
                int r2 = Math.Min( radius, -q + radius );
                for (int r = r1; r <= r2; r++) {
                    HexCoordinates h = new HexCoordinates( q, r );
                    board.Tiles.Add( h, Math.Abs(h.Q) ==4 || Math.Abs(h.R) == 4 || Math.Abs(h.S) == 4 ? Tile.Sky.TileCode : Tile.Empty.TileCode);
                }
            }
            return board;
        }

        public BoardDto Dto () {
            
            Dictionary<HexCoordinates, uint> tileDtos = new Dictionary<HexCoordinates, uint>();
            foreach ( (HexCoordinates hex, uint tile) in Tiles ) {
                tileDtos.Add( hex, tile );
            }
            return new BoardDto {
                                    TreeTiles = TreeTiles.ToArray(),
                                    Tiles = tileDtos,
                                    SunPosition = SunPosition
                                };
            
            
        }

        public class Shadow : List<ShadowHex> {
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
            
            public static Shadow GetShadow (HexCoordinates hex, SunPosition sunPosition, PieceType pieceType) {
                Board.Shadow shadow = new Board.Shadow();
                int height = (int) pieceType;
                for (int i = 0; i < (int) pieceType; i++) {
                    shadow.Add( new ShadowHex( hex + (i * ShadowDirection( sunPosition )), height ) );
                }
                return shadow;
            }
        }

        public Tile? GetTileAt (HexCoordinates hex) => Tiles.TryGetValue( hex, out uint tile ) ? new Tile(tile) : null;

        public class ShadowDictionary : Dictionary<HexCoordinates, int> {}

        public class ShadowHex : Tuple<HexCoordinates, int> {
            public ShadowHex (HexCoordinates hex, int height) : base( hex, height ) { }
        }

        public void UpdateAllShadows (SunPosition sunPos) {
            ShadowDictionary shadows = CalculateShadows( sunPos );

            foreach ( KeyValuePair<HexCoordinates, uint> tilePair in Tiles ) {
                (HexCoordinates hex, uint tileCode) = tilePair;
                Tile tile = new Tile( tileCode ) {
                                                     ShadowHeight = shadows.TryGetValue( hex, out int shadowHeight )
                                                                        ? shadowHeight
                                                                        : 0
                                                 };
            }
        }

        public void ReplaceShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int height) = shadowHex;
                if ( !Tiles.TryGetValue( hex, out uint tileCode ) ) continue;
                Tile tile = new Tile( tileCode ) { ShadowHeight = height };
                Tiles[hex] = tile.TileCode;
            }
        }
        
        public void ApplyShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int shadowHeight) = shadowHex;
                if ( !Tiles.TryGetValue( hex, out uint tileCode ) ) continue;
                Tile tile = new Tile( tileCode );
                tile.ShadowHeight = Math.Max( shadowHeight, tile.ShadowHeight );
                Tiles[hex] = tile.TileCode;
            }
        }
        
        public ShadowDictionary CalculateShadows (SunPosition sunPos) {
            ShadowDictionary shadowDictionary = new ShadowDictionary();

            foreach ( HexCoordinates treePos in TreeTiles ) {
                if (!Tiles.TryGetValue( treePos, out uint tile )) throw new Exception("treePos is not a valid Tile");
                PieceType? pieceType = GetTileAt( treePos )?.PieceType;
                if(pieceType == null) continue;
                Shadow tileShadow = Shadow.GetShadow(treePos, sunPos, (PieceType) pieceType);

                foreach ( ShadowHex shadowHex in tileShadow ) {
                    (HexCoordinates hex, int height) = shadowHex;

                    if ( shadowDictionary.TryGetValue( hex, out int tileHeight ) ) {
                        shadowDictionary[hex] = Math.Max( height, tileHeight );
                    } else {
                        shadowDictionary[hex] = height;
                    }
                }
            }

            return shadowDictionary;
        }

        public Dictionary<TreeType, int> CountLight () {
            Dictionary<TreeType, int> lightCounts = new Dictionary<TreeType, int> {
                                                                                 { TreeType.Ash, 0 },
                                                                                 { TreeType.Aspen, 0 },
                                                                                 { TreeType.Birch, 0 },
                                                                                 { TreeType.Poplar, 0 }
                                                                             };

            foreach ( KeyValuePair<HexCoordinates,uint> boardTile in Tiles ) {
                (_, uint tileCode) = boardTile;
                Tile tile = new Tile(tileCode);
                if ( !tile.ProducesLight  || tile.TreeType == null) continue;
                TreeType treeType = (TreeType) tile.TreeType;
                lightCounts[treeType] += tile.Light;
            }

            return lightCounts;
        }

        public void SetTileAt (in HexCoordinates target, Tile tile) { Tiles[target] = tile.TileCode; }
    }

}
