using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
    public class GameAction {
        [BsonRepresentation(BsonType.String)]
        public string PlayerId { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public GameActionType ActionType { get; set; }
        public PieceType? PieceType { get; set; }
        public HexCoordinates? target { get; set; }
        public HexCoordinates? origin { get; set; }
    }
}
