using dotnet_tree_shadows.Authentication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class FriendProfile {
        public string Name;
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;

        public FriendProfile (UserModel profile) {
            Name = profile.UserName;
            Id = profile.UserId;
        }
    }
}
