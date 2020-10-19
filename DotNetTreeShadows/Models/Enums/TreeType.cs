using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.Enums {
  [JsonConverter(typeof(StringEnumConverter))]
  public enum TreeType {
        Ash,
        Aspen,
        Birch,
        Poplar
    }
}
