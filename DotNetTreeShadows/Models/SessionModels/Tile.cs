using System;
using System.Runtime.CompilerServices;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Models {

    public class Tile {
        public uint TileCode { get; protected set; }
        
        public PieceType? PieceType {
            get {
                if ( TileType != TileTypes.Piece ) return null;
                return (PieceType) (TileCode & 3);
            }
            set {
                if ( value != null ) {
                    TileType = TileTypes.Piece;
                    TileCode &= ~(uint) 3;
                    TileCode |= ((uint) value);
                    return;
                }

                TileType = TileTypes.Empty;
            }
        }

        public TreeType? TreeType {
            get {
                if ( TileType != TileTypes.Piece ) return null;
                return (TreeType) ((TileCode >> 2) & 3);
            }
            set {
                if ( value != null ) {
                    TileType = TileTypes.Piece;
                    TileCode &= ~((uint) 3 << 2);
                    TileCode |= (uint) value << 2;
                    return;
                }

                TileType = TileTypes.Empty;
            }
        }

        private enum TileTypes {
            Empty,
            Piece,
            Sky
        }
        
        private TileTypes TileType {
            get => (TileTypes) ((TileCode >> 4) & 3);
            set {
                TileCode &= ~((uint) 3 << 4);
                TileCode |= (uint) value << 4;
            }
        }

        public int ShadowHeight {
            get => (int) (TileCode >> 4) & 3;
            set {
                TileCode &= ~((uint) 3 << 6);
                TileCode |= (uint) value << 6;
            }
        }

        public Tile () { }

        public Tile (uint tileCode) { this.TileCode = tileCode; }
        
        public Tile (PieceType pieceType, TreeType treeType) {
            TileCode = (uint) pieceType | ((uint) treeType << 2);
        }

        public override string ToString () => TileType switch {
            TileTypes.Empty => $"[Tile - {TileType}, shadowHeight: {ShadowHeight}]",
            TileTypes.Piece => $"[Tile - {TileType}, {TreeType}, {PieceType}, {ShadowHeight}]",
            TileTypes.Sky => $"[Tile - {TileType}]",
            _ => throw new ArgumentOutOfRangeException()
        };

        public int Light {
            get {
                if ( PieceType == null || TreeType == null) return 0;
                return (int) PieceType > ShadowHeight
                           ? (int) PieceType
                           : 0;
            }
        }
        
        public bool ProducesLight {
            get => PieceType != null && (uint) PieceType > ShadowHeight;
        }
        
        
        public override int GetHashCode () =>
            TileCode.GetHashCode();
        
        
        public static Tile Sky {
            get => new Tile( (uint) TileTypes.Sky << 6 );
        }

        public static Tile Empty {
            get => new Tile( 0 );
        }
        
    }
}
