using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.BoardModel {
  public class Board {

    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    
    public Dictionary<Hex, int> Tiles = new Dictionary<Hex, int>();
    
    public void Add (Hex h, int i) {
      Tiles.TryAdd( h, i );
    }
    
    public bool TryGetValue (in Hex target, out int tileCode) => Tiles.TryGetValue( target, out tileCode );

  }
}
