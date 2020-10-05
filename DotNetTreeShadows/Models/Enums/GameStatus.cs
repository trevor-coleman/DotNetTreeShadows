using System.Text.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.SessionModels {
  [JsonConverter(typeof(StringEnumConverter))]
  public enum GameStatus {
    Preparing,
    PlacingFirstTrees,
    InProgress,
    Ended
  }
}
