
using System.Text.Json.Serialization;

namespace dotnet_tree_shadows.Models {
    [JsonConverter( typeof( JsonStringEnumConverter) )]
    public enum PieceType {
        Seed,
        SmallTree,
        MediumTree,
        LargeTree
    }
}
