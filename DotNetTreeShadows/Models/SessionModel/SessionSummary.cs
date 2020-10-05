using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class SessionSummary {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }

        public SessionSummary () {
            Id = "";
            Name = "";
        }
            
        public SessionSummary (string id, string name) {
            Id = id;
            Name = name;
        }

    }
}
