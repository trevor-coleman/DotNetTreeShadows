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
    public int? TargetCode { get; set; }
    public int? OriginCode { get; set; }
    public string? TargetPlayerId { get; set; }

    public Hex Target {
      get => new Hex(TargetCode);
    }
    public Hex Origin {
      get => new Hex(OriginCode);
    }
    
    public static bool HasRequiredProps (ActionRequest request, params string[] requiredPropNames) {
      return (from propName in requiredPropNames select request.GetType().GetProperty( propName )).All( propertyInfo => propertyInfo.GetValue( request, null ) != null );
    }
    
  }
  
  
}
