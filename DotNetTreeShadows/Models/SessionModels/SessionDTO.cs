using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModels {
        
    public class SessionDTO {
        [BsonRepresentation( BsonType.ObjectId )]
        public string Host { get; set; }

        public string[] Players;
        public GameDTO Game { get; set; }
        public string Name { get; set; }
        public string[] Invitations { get; set; }
    }
}
