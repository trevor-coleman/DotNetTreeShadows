using System;

namespace dotnet_tree_shadows.Models {
    public class Resource {
        public int Available { get; set; }
        public int OnBoard { get; set; }
        public int TotalAvailable { get; }

        public Resource (int available, int onBoard, int totalAvailable) {
            Available = available;
            OnBoard = onBoard;
            TotalAvailable = totalAvailable;
        }

        public static Resource StartingAmount (PieceType pieceType) {
            switch ( pieceType ) {
                case PieceType.Seed: 
                    return new Resource( 2,4,6 );
                case PieceType.SmallTree: 
                    return new Resource( 4,4, 8);
                case PieceType.MediumTree: 
                    return new Resource( 1,3,4);
                case PieceType.LargeTree: 
                    return new Resource( 0, 2, 2 );
                default: throw new ArgumentOutOfRangeException( nameof(pieceType), pieceType, null );
            }
        }
        
    }
}
