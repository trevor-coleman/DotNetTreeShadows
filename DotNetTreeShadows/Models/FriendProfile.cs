using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class FriendProfile {
        public string Name;
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;

        public FriendProfile (Profile profile) {
            Name = profile.Name;
            Id = profile.Id;
        }
    }
}
