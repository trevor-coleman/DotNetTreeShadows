using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameModel;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class TokenStacksSerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( TokenStacks )
        ? new TokenStacksSerializer()
        : null;

    public class TokenStacksSerializer : DictionarySerializerBase<TokenStacks> {

      public TokenStacksSerializer () : base(
          DictionaryRepresentation.Document,
          new Int32Serializer(BsonType.String),
          new ArraySerializer<int>()
        ) { }

      protected override TokenStacks CreateInstance () => new TokenStacks();

    }

  }
}
