using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class GameOptionsDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( GameOptionsDictionary )
        ? new GameOptionsDictionarySerializer()
        : null;

    public class GameOptionsDictionarySerializer : DictionarySerializerBase<Dictionary<GameOption, bool>> {

      public GameOptionsDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new EnumSerializer<GameOption>(BsonType.String),
          new BooleanSerializer()
        ) { }

      protected override Dictionary<GameOption, bool> CreateInstance () => new Dictionary<GameOption, bool>();

    }

  }
}
