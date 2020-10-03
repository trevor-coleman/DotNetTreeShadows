using System;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Options;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class GameOptionsDictionarySerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( GameOptionsDictionary )
        ? new TileDictionarySerializer()
        : null;

    public class TileDictionarySerializer : DictionarySerializerBase<GameOptionsDictionary> {

      public TileDictionarySerializer () : base(
          DictionaryRepresentation.Document,
          new StringSerializer(),
          new BooleanSerializer()
        ) { }

      protected override GameOptionsDictionary CreateInstance () => new GameOptionsDictionary();

    }

  }
}
