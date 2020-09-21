using System;
using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {
    public class Board : Dictionary<HexCoordinates, Tile> {
        public static Board New (int radius = 4) {
            Board board = new Board();
            for (int q = -radius; q <= radius; q++) {
                int r1 = Math.Max( -radius, -q - radius );
                int r2 = Math.Min( radius, -q + radius );
                for (int r = r1; r <= r2; r++) {
                    HexCoordinates h = new HexCoordinates( q, r );
                    board.Add( h, new Tile( h ) );
                }
            }
            return board;
        }
    }
}
