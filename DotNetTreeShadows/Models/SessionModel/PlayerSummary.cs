using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModel {
  public class PlayerSummary {

    public PlayerSummary () { }
    public PlayerSummary (UserModel user) {
      Id = user.UserId;
      Name = user.UserName;
    }

    public static PlayerSummary CreateFromUser (UserModel userModel) =>
      new PlayerSummary {
        Id = userModel.UserId,
        Name = userModel.UserName
      };

    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    public string Name { get; set; } = "Player";
    [BsonRepresentation(BsonType.String)]
    public TreeType? TreeType { get; set; }
  }
}
