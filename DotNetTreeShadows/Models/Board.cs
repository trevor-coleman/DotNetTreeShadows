using System;
using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {
    public class Board : Dictionary<HexCoordinates, Tile> {
        public List<HexCoordinates> TreeTiles { get; set; }
        
        
        public static Board New (int radius = 4) {
            var board = new Board();
            for (int q = -radius; q <= radius; q++) {
                int r1 = Math.Max( -radius, -q - radius );
                int r2 = Math.Min( radius, -q + radius );
                for (int r = r1; r <= r2; r++) {
                    var h = new HexCoordinates( q, r );
                    board.Add( h, new Tile( h ) );
                }
            }
            board.TreeTiles = new List<HexCoordinates>();
            return board;
        }

        public class Shadow : List<ShadowHex> { }

        public class ShadowDictionary : Dictionary<HexCoordinates, int> {}

        public class ShadowHex : Tuple<HexCoordinates, int> {
            public ShadowHex (HexCoordinates hex, int height) : base( hex, height ) { }
        }

        public void UpdateAllShadows (SunPosition sunPos) {
            ShadowDictionary shadows = CalculateShadows( sunPos );

            foreach ( KeyValuePair<HexCoordinates, Tile> tilePair in this ) {
                (HexCoordinates hex, Tile tile) = tilePair;
                tile.ShadowHeight = shadows.TryGetValue( hex, out int shadowHeight)
                                        ? shadowHeight
                                        : 0;
            }
        }

        public void ReplaceShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int height) = shadowHex;
                if ( TryGetValue( hex, out Tile tile ) ) {
                    tile.ShadowHeight = height;
                } 
            }
        }
        
        public void ApplyShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int shadowHeight) = shadowHex;
                if ( TryGetValue( hex, out Tile tile ) ) {
                    tile.ShadowHeight = Math.Max( shadowHeight, tile.ShadowHeight );
                } 
            }
        }
        
        public ShadowDictionary CalculateShadows (SunPosition sunPos) {
            var shadowDictionary = new ShadowDictionary();

            foreach ( HexCoordinates treePos in TreeTiles ) {
                TryGetValue( treePos, out Tile tile );
                Shadow tileShadow = tile.GetShadow( sunPos );

                foreach ( ShadowHex shadowHex in tileShadow ) {
                    var (hex, height) = shadowHex;

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
            var light = new Dictionary<TreeType, int> {
                                                          { TreeType.Ash, 0 },
                                                          { TreeType.Aspen, 0 },
                                                          { TreeType.Birch, 0 },
                                                          { TreeType.Poplar, 0 }
                                                      };

            foreach ( KeyValuePair<HexCoordinates,Tile> boardTile in this ) {
                (_, Tile tile) = boardTile;
                if ( !tile.ProducesLight ) continue;
                var treeType = (TreeType) tile.TreeType;
                light[treeType] += tile.Light;
            }

            return light;
        }

        

    }
}
