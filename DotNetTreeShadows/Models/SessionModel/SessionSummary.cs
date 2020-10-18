using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModel {
    public class SessionSummary {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Host { get; set; }

        public SessionSummary () {
            Id = "";
            Name = "";
        }
        
        public SessionSummary (string id, string name, string host) {
            Id = id;
            Name = name;
            Host = host;
        }

    }
}
