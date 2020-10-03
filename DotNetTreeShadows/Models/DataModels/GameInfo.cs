using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Services {
  public class GameInfo {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string FirstPlayer { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public int CurrentTurn { get; set; } = 0;

    public string[] TurnOrder { get; set; } = new string[0];
    
    public int Revolution = 0;

    [BsonRepresentation( BsonType.String )]
    public SunPosition SunPosition { get; set; } = SunPosition.NorthWest;
    
    [BsonDictionaryOptions(DictionaryRepresentation.Document)]
    public Dictionary<int, int[]> ScoringTokens { get; set; } = new Dictionary<int, int[]>();
  }
}
