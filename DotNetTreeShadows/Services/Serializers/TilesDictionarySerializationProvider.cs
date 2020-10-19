using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class TilesDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer GetSerializer (Type type) =>
      type == typeof( Dictionary<Hex, int> )
        ? new TilesDictionarySerializer()
        : null;

    public class TilesDictionarySerializer : DictionarySerializerBase<Dictionary<Hex, int>> {

      public TilesDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new HexCoordinatesSerializationProvider.HexCoordinatesSerializer(),
          new Int32Serializer()
        ) { }

      protected override Dictionary<Hex, int> CreateInstance () => new Dictionary<Hex, int>();

    }

  }
}