using System;
using dotnet_tree_shadows.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Newtonsoft.Json;

namespace dotnet_tree_shadows.Services.Serializers {
  public class HexSerializationProvider : IBsonSerializationProvider {

    public IBsonSerializer? GetSerializer (Type type) =>
      type == typeof( Hex )
        ? new HexCoordinatesSerializer()
        : null;

    public class HexCoordinatesSerializer:SerializerBase<Hex> {
      
      public override void Serialize (
          BsonSerializationContext context,
          BsonSerializationArgs args,
          Hex value
        ) {

        int[] valueArray = value.ToArray();
        
        context.Writer.WriteString( JsonConvert.SerializeObject( valueArray ) );
      }

      public override Hex Deserialize (BsonDeserializationContext context, BsonDeserializationArgs args) {
        BsonType type = context.Reader.GetCurrentBsonType();
        
        string value = context.Reader.ReadString();
        
        int[] coordinates = JsonConvert.DeserializeObject<int[]>(value );
        
        return new Hex(coordinates);
      }

    }

  }
}
