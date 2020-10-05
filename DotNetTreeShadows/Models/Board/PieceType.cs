using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.BoardModel {
    [JsonConverter( typeof( StringEnumConverter ) )]
    public enum PieceType {
        Seed,
        SmallTree,
        MediumTree,
        LargeTree
    }
}
