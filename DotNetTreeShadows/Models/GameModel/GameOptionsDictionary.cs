using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Security.Permissions;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Utilities;

namespace dotnet_tree_shadows.Models.GameModel {
  [Serializable]
  public class GameOptionsDictionary {

    public GameOptionsDictionary () { }

    private Dictionary<GameOption, bool> gameOptions = new Dictionary<GameOption, bool>();

    protected GameOptionsDictionary (SerializationInfo info, StreamingContext context) {

      foreach ( GameOption option in EnumUtil.GetValues<GameOption>() ) {
        string? optionName = Enum.GetName( typeof( GameOption ), (int) option );
        if ( optionName == null ) continue;

        try {
          bool value = info.GetBoolean( optionName );
          gameOptions.Add( option, true );
        }
        catch(Exception e) {
          Console.WriteLine("------------ GAME OPTIONS DICT SERIALIZATION EXCEPTION");
          Console.WriteLine(e);
        }
      }
    }

    [SecurityPermission(SecurityAction.Demand, SerializationFormatter = true)]
    public void GetObjectData(SerializationInfo info, StreamingContext context)
    {
      foreach ( GameOption option in EnumUtil.GetValues<GameOption>() ) {
        if ( !gameOptions.TryGetValue( option, out bool value ) || !value ) continue;
        string? optionName = Enum.GetName( typeof(GameOption), (int) option );
        if(optionName == null) continue;
        info.AddValue( optionName , true );
      }
    }  
    
    
    public void Add (GameOption option) { gameOptions.TryAdd( option, true ); }

    public void Remove (GameOption option) {
      if ( gameOptions.ContainsKey( option ) ) gameOptions.Remove( option );
    }

    public bool Has (GameOption option) => gameOptions.ContainsKey( option );

    public void Set (GameOption option, bool value) {
      if ( value ) {
        Add( option );
        return;
      }

      Remove( option );
    }
    
  }
}
