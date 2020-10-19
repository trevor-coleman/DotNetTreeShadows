using System;
using System.Collections.Generic;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Permissions;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Utilities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
  [Serializable]
  public class Board {

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public Dictionary<Hex, int> Tiles = new Dictionary<Hex, int>();
    
    public void Add (Hex h, int i) {
      Tiles.TryAdd( h, i );
    }

    public int Get (Hex h) => Tiles[h];
    public int Set (Hex h, int value) => Tiles[h] = value;

    public bool TryGetValue (in Hex target, out int tileCode) => Tiles.TryGetValue( target, out tileCode );

    public int this [Hex hexCode] {
      get => Tiles[hexCode];
      set => Tiles[hexCode] = value;
    }

  }
}
