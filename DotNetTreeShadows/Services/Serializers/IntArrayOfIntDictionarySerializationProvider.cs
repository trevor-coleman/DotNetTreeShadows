using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class IntArrayOfIntDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( Dictionary<int, int[]> )
        ? new IntArrayOfIntDictionarySerializer()
        : null;

    public class IntArrayOfIntDictionarySerializer : DictionarySerializerBase<Dictionary<int, int[]>> {

      public IntArrayOfIntDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new Int32Serializer(BsonType.String),
          new ArraySerializer<int>()
        ) { }

      protected override Dictionary<int, int[]> CreateInstance () => new Dictionary<int, int[]>();

    }

  }
}
