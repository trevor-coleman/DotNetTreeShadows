using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class IntIntDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( Dictionary<int, int> )
        ? new IntIntDictionarySerializer()
        : null;

    public class IntIntDictionarySerializer : DictionarySerializerBase<Dictionary<int, int>> {

      public IntIntDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new Int32Serializer(BsonType.String),
          new Int32Serializer(BsonType.String)
        ) { }

      protected override Dictionary<int, int> CreateInstance () => new Dictionary<int, int>();

    }

  }
}
