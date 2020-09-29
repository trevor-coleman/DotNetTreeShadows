using System.Text.Json.Serialization;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
    public class GameAction {
        [BsonRepresentation( BsonType.ObjectId )]
        public string PlayerId { get; set; } = "";

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public GameActionType ActionType { get; set; } = GameActionType.EndTurn;

        public PieceType? PieceType { get; set; } = SessionModels.PieceType.Seed;
        public HexCoordinates? Target { get; set; } = HexCoordinates.Zero;
        public HexCoordinates? Origin { get; set; } = HexCoordinates.Zero;
    }
}
