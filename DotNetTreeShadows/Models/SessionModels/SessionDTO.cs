using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModels {
        
    public class SessionDto {
        [BsonRepresentation( BsonType.ObjectId )]
        public string Host { get; set; } = "";

        public string[] Players = {};
        public GameDto Game { get; set; } = new GameDto();
        public string Name { get; set; } = "";
        public string[] Invitations { get; set; } = { };
    }
}
