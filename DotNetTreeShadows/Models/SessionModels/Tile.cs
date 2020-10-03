using System;
using System.Runtime.CompilerServices;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Models {

    public class Tile {
        public int TileCode { get; protected set; }
        
        public PieceType? PieceType {
            get {
                if ( TileType != TileTypes.Piece ) return null;
                return (PieceType) (TileCode & 3);
            }
            set {
                if ( value != null ) {
                    TileType = TileTypes.Piece;
                    TileCode &= ~(int) 3;
                    TileCode |= ((int) value);
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
                    TileCode &= ~((int) 3 << 2);
                    TileCode |= (int) value << 2;
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
                TileCode &= ~((int) 3 << 4);
                TileCode |= (int) value << 4;
            }
        }

        public int ShadowHeight {
            get => (int) (TileCode >> 4) & 3;
            set {
                TileCode &= ~((int) 3 << 6);
                TileCode |= (int) value << 6;
            }
        }

        public Tile () { }

        public Tile (int tileCode) { this.TileCode = tileCode; }
        
        public Tile (PieceType pieceType, TreeType treeType) {
            TileCode = (int) pieceType | ((int) treeType << 2);
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
            get => PieceType != null && (int) PieceType > ShadowHeight;
        }
        
        
        public override int GetHashCode () =>
            TileCode.GetHashCode();
        
        
        public static Tile Sky {
            get => new Tile( (int) TileTypes.Sky << 6 );
        }

        public static Tile Empty {
            get => new Tile( 0 );
        }
        
    }
}
