using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Actions {
  
  [JsonConverter(typeof(StringEnumConverter))]  
  public enum GameActionType {
        Buy,
        Plant,
        Grow,
        Collect,
        EndTurn,
        StartGame,
        PlaceStartingTree,
        PlaceSecondTree,
        UndoAction,
        Resign,
        Kick,
    }
}
