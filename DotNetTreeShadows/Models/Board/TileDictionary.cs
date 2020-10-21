using System.Collections.Generic;
using System.ComponentModel;

namespace dotnet_tree_shadows.Models {
  [TypeConverter( typeof( HexIntDictionaryConverter ) )]
  public class TileDictionary : Dictionary<Hex, int> {
    public TileDictionary () : base() { }
    public TileDictionary (TileDictionary p) : base(p) { }

  }
}
