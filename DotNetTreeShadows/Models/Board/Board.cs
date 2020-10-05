using System.Collections;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models.BoardModel {
  public class Board : IEnumerable<KeyValuePair<Hex, int>> {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonDictionaryOptions(DictionaryRepresentation.Document)]
    public Dictionary<Hex, int> tiles;
    
    public int this[Hex index]
    {
      get => tiles[index];
      set => tiles[index] = value;
    }

    public void Add (Hex h, int i) {
      tiles.TryAdd( h, i );
    }
    
    public IEnumerator<KeyValuePair<Hex, int>> GetEnumerator () {
      foreach ( KeyValuePair<Hex,int> keyValuePair in tiles ) {
        yield return keyValuePair;
      } 
    }
    IEnumerator IEnumerable.GetEnumerator () => GetEnumerator();

    public bool TryGetValue (in Hex target, out int tileCode) => tiles.TryGetValue( target, out tileCode );

  }
}
