using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModel {
    public class SessionSummary {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Host { get; set; }
        public string HostName { get; set; }

        public SessionSummary () {
            Id = "";
            Name = "";
            HostName = "";
        }
        
        public SessionSummary (string id, string name, string host, string hostName) {
            Id = id;
            Name = name;
            Host = host;
            HostName = hostName;

        }

    }
}
