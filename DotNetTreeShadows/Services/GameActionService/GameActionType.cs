
using System.Text.Json.Serialization;

namespace dotnet_tree_shadows.Services.GameActionService {
  
  [JsonConverter( typeof( JsonStringEnumConverter ) )]  
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
