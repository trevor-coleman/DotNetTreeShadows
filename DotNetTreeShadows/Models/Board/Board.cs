using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Permissions;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Utilities;
using Mongo.Migration.Documents;
using Mongo.Migration.Documents.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace dotnet_tree_shadows.Models {
  [RuntimeVersion("0.0.1")]
  public class Board:IDocument {

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    
    public TileDictionary Tiles = new TileDictionary();
    
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

    public DocumentVersion Version { get; set; }

  }
}
