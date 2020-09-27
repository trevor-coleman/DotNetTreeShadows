using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class SessionDTO : NewSessionDTO {
        [BsonRepresentation( BsonType.ObjectId )]
        public string ID { get; set; }
    }
    
    public class NewSessionDTO {
        [BsonRepresentation( BsonType.ObjectId )]
        public string Host { get; set; }

        public string[] Players;
        public GameDTO Game { get; set; }
        public string Name { get; set; }
        public string[] Invitations { get; set; }
    }
}
