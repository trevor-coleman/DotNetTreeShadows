using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Controllers {
  public class ActionRequest {
    
    [BsonRepresentation(BsonType.String)]
    public GameActionType Type { get; set; }
    public PieceType? PieceType { get; set; }
    public int? Target { get; set; }
    public int? Origin { get; set; }
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ActionId { get; set; }
    public string? TargetPlayerId { get; set; }
    public Hex TargetHex { get => new Hex(Target); }
    public Hex OriginHex { get => new Hex(Origin); }

    public bool HasRequiredProps (params string[] requiredPropNames) {
      return (from propName in requiredPropNames select GetType().GetProperty( propName )).All( propertyInfo => propertyInfo.GetValue( this, null ) != null );
    }
    
  }
  
  
}
