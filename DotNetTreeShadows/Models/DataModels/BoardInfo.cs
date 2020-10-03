using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models.DataModels {
  public class BoardInfo {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonDictionaryOptions(DictionaryRepresentation.Document)]
    public Dictionary<HexCoordinates, int> tiles;
  }
}
