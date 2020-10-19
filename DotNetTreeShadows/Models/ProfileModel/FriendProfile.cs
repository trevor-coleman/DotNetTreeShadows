using System;
using dotnet_tree_shadows.Models.Authentication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.ProfileModel {
  public class FriendProfile {
        public string Name = "";
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id = "";
        
        public FriendProfile(){}

        public FriendProfile (UserModel profile) {
            Name = profile.UserName;
            Id = profile.UserId;
        }
        
        
    }
}
