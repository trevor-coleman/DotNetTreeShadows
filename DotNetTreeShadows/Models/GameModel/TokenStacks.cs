using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.GameModel {
  public class TokenStacks : Dictionary<int, int[]> {

    private static readonly int[] OneLeafTiles = { 12,12,12,12,13,13,14,14 };//{ 14, 14, 13, 13, 12, 12, 12, 12 };
    private static readonly int[] TwoLeafTiles = { 13, 13, 13, 14, 14, 16, 16, 17 };//{ 17, 16, 16, 14, 14, 13, 13, 13 };
    private static readonly int[] ThreeLeafTiles = {17,17,18,18,19 };//{ 19, 18, 18, 17, 17 };
    private static readonly int[] FourLeafTiles =  { 20,21,22 };

    public static TokenStacks StartingStacks {
      get =>
        new TokenStacks {
          { 1, OneLeafTiles },
          { 2, TwoLeafTiles },
          { 3, ThreeLeafTiles },
          { 4, FourLeafTiles }
        };
    }

    public new int[] this [int index] {
      get =>
        TryGetValue( index, out int[]? stack )
          ? stack
          : new int[0];

      set {
        if ( ContainsKey( index ) ) Remove( index );
        Add( index, value );
      }
    }

  }
}
