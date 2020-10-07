using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services.Serializers {
  public class IntStackDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( Dictionary<int, Stack<int>> )
        ? new IntStackDictionarySerializer()
        : null;

    public class IntStackDictionarySerializer : DictionarySerializerBase<Dictionary<int, Stack<int>>> {

      public IntStackDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new Int32Serializer(BsonType.String),
          new StackSerializer<int>()
        ) { }

      protected override Dictionary<int, Stack<int>> CreateInstance () => new Dictionary<int, Stack<int>>();

    }

  }
}
