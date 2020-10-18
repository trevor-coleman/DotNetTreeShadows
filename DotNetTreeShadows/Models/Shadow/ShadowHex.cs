using System;

namespace dotnet_tree_shadows.Models.Shadow {
  public class ShadowHex : Tuple<Hex, int> {
    public ShadowHex (Hex hex, int height) : base( hex, height ) { }
  }
}
