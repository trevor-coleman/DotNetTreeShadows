using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services.Serializers {
  public class TilesDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer GetSerializer (Type type) =>
      type == typeof( Dictionary<HexCoordinates, int> )
        ? new TileDictionarySerializer()
        : null;

    public class TileDictionarySerializer : DictionarySerializerBase<Dictionary<HexCoordinates, int>> {

      public TileDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new HexCoordinatesSerializationProvider.HexCoordinatesSerializer(),
          new Int32Serializer()
        ) { }

      protected override Dictionary<HexCoordinates, int> CreateInstance () => new Dictionary<HexCoordinates, int>();

    }

  }
}