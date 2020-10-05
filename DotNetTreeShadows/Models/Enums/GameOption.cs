using System.Text.Json.Serialization;

namespace dotnet_tree_shadows.Services {
  [JsonConverter( typeof( JsonStringEnumConverter ) )]
  public enum GameOption {

    PreventActionsInShadow,
    AssignTurnOrder,
    LongGame,

  }
}
