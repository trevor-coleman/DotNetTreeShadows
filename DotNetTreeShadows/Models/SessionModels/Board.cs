using System;
using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class Board {
        public List<HexCoordinates> TreeTiles { get; set; } = new List<HexCoordinates>();
        public readonly Dictionary<HexCoordinates, Tile> Tiles = new Dictionary<HexCoordinates, Tile>();
        public SunPosition SunPosition = SunPosition.NorthEast;
        
        public static Board New (int radius = 4) {
            Board board = new Board();
            for (int q = -radius; q <= radius; q++) {
                int r1 = Math.Max( -radius, -q - radius );
                int r2 = Math.Min( radius, -q + radius );
                for (int r = r1; r <= r2; r++) {
                    HexCoordinates h = new HexCoordinates( q, r );
                    board.Tiles.Add( h, new Tile( h ) );
                }
            }
            return board;
        }

        public BoardDTO DTO () {
            
            var tileDTOs = new Dictionary<HexCoordinates, TileDTO>();
            foreach ( (HexCoordinates hex, var tile) in Tiles ) {
                tileDTOs.Add( hex, tile.DTO() );
            }
            return new BoardDTO {
                                    TreeTiles = TreeTiles.ToArray(),
                                    Tiles = tileDTOs,
                                    SunPosition = SunPosition
                                };
            
            
        }

        public class Shadow : List<ShadowHex> { }

        public class ShadowDictionary : Dictionary<HexCoordinates, int> {}

        public class ShadowHex : Tuple<HexCoordinates, int> {
            public ShadowHex (HexCoordinates hex, int height) : base( hex, height ) { }
        }

        public void UpdateAllShadows (SunPosition sunPos) {
            ShadowDictionary shadows = CalculateShadows( sunPos );

            foreach ( KeyValuePair<HexCoordinates, Tile> tilePair in Tiles ) {
                (HexCoordinates hex, Tile tile) = tilePair;
                tile.ShadowHeight = shadows.TryGetValue( hex, out int shadowHeight)
                                        ? shadowHeight
                                        : 0;
            }
        }

        public void ReplaceShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int height) = shadowHex;
                if ( Tiles.TryGetValue( hex, out Tile tile ) ) {
                    tile.ShadowHeight = height;
                } 
            }
        }
        
        public void ApplyShadow (Shadow shadow) {
            foreach ( ShadowHex shadowHex in shadow ) {
                (HexCoordinates hex, int shadowHeight) = shadowHex;
                if ( Tiles.TryGetValue( hex, out Tile tile ) ) {
                    tile.ShadowHeight = Math.Max( shadowHeight, tile.ShadowHeight );
                } 
            }
        }
        
        public ShadowDictionary CalculateShadows (SunPosition sunPos) {
            var shadowDictionary = new ShadowDictionary();

            foreach ( HexCoordinates treePos in TreeTiles ) {
                Tiles.TryGetValue( treePos, out Tile tile );
                Shadow tileShadow = tile.GetShadow( sunPos );

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
            Dictionary<TreeType, int> light = new Dictionary<TreeType, int> {
                                                                                 { TreeType.Ash, 0 },
                                                                                 { TreeType.Aspen, 0 },
                                                                                 { TreeType.Birch, 0 },
                                                                                 { TreeType.Poplar, 0 }
                                                                             };

            foreach ( KeyValuePair<HexCoordinates,Tile> boardTile in Tiles ) {
                (_, Tile tile) = boardTile;
                if ( !tile.ProducesLight ) continue;
                TreeType treeType = (TreeType) tile.TreeType;
                light[treeType] += tile.Light;
            }

            return light;
        }

        

    }

}
