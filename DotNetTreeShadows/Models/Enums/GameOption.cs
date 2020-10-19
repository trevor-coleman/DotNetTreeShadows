using System.Text.Json.Serialization;

namespace dotnet_tree_shadows.Models.Enums {
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum GameOption {
    PreventActionsInShadow,
    AssignTurnOrder,
    LongGame,
  }
}
