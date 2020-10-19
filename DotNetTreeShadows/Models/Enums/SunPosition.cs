using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.Enums {
  [JsonConverter(typeof(StringEnumConverter))]  
  public enum SunPosition {
        NorthWest,
        NorthEast,
        East,
        SouthEast,
        SouthWest,
        West
    }
}
