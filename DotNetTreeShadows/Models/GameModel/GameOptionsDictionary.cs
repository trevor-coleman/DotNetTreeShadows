using System.Collections.Generic;
using dotnet_tree_shadows.Models.Enums;

namespace dotnet_tree_shadows.Models.GameModel {
  public class GameOptionsDictionary : Dictionary<GameOption, bool> {

    public void Add (GameOption option) { TryAdd( option, true ); }

    public void Remove (GameOption option) {
      if ( ContainsKey( option ) ) base.Remove( option );
    }

    public bool Has (GameOption option) => ContainsKey( option );

    public void Set (GameOption option, bool value) {
      if ( value ) {
        Add( option );
        return;
      }

      Remove( option );
    }
    
  }
}
