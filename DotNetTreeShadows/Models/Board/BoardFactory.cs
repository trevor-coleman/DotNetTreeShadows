using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.BoardModel {
  public class BoardFactory {

    public static Board New (string id = "", int radius = 4) {
      Board board = new Board() {
        Id=id,
        Tiles=new Dictionary<Hex, int>()
      };
      for (int q = -radius; q <= radius; q++) {
        int r1 = Math.Max( -radius, -q - radius );
        int r2 = Math.Min( radius, -q + radius );
        for (int r = r1; r <= r2; r++) {
          Hex h = new Hex( q, r );
          board.Add( h, (Math.Abs(h.Q) ==4 || Math.Abs(h.R) == 4 || Math.Abs(h.S) == 4) ? Tile.Sky : Tile.Empty);
        }
      }
      return board;
    }

  }
}
