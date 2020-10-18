using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
  public class Board {

    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public Dictionary<int, int> Tiles = new Dictionary<int, int>();
    
    public void Add (Hex h, int i) {
      Tiles.TryAdd( h.HexCode, i );
    }

    public int Get (Hex h) => Tiles[h.HexCode];
    public int Set (Hex h, int value) => Tiles[h.HexCode] = value;

    public bool TryGetValue (in Hex target, out int tileCode) => Tiles.TryGetValue( target.HexCode, out tileCode );

  }
}
