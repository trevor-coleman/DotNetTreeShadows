using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
  
  [JsonConverter(typeof(StringEnumConverter))]  
  public enum GameActionType {
        Buy,
        Plant,
        Grow,
        Collect,
        EndTurn,
        StartGame,
        PlaceStartingTree,
        UndoAction,
        Resign,
        Kick,
    }
}
