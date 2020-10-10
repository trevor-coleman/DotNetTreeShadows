using System.Linq;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Controllers {
  public class ActionRequest {
    
    [BsonRepresentation(BsonType.String)]
    public GameActionType Type { get; set; }
    public PieceType? PieceType { get; set; }
    public int? Target { get; set; }
    public int? Origin { get; set; }
    public string? TargetPlayerId { get; set; }
    
    public static bool HasRequiredProps (ActionRequest request, params string[] requiredPropNames) {
      return (from propName in requiredPropNames select request.GetType().GetProperty( propName )).All( propertyInfo => propertyInfo.GetValue( request, null ) != null );
    }
    
  }
  
  
}
