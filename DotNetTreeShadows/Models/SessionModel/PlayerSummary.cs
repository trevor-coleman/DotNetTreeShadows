using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.DataModels {
  public class PlayerSummary {

    public static PlayerSummary Create (UserModel userModel) =>
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
