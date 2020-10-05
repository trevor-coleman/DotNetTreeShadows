using System;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

namespace dotnet_tree_shadows.Services.Serializers {
  public class HexCoordinatesSerializationProvider : IBsonSerializationProvider {

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
        int hexCode = 0;

        sbyte q = (sbyte) value.Q;
        sbyte r = (sbyte) value.R;
        sbyte s = (sbyte) value.S;

        hexCode |= (q & 0xff) << 16 ;
        hexCode |= (r & 0xff) << 8;
        hexCode |= s & 0xff << 0;
        
        
        context.Writer.WriteString( hexCode.ToString() );
      }

      public override Hex Deserialize (BsonDeserializationContext context, BsonDeserializationArgs args) {
        BsonType type = context.Reader.GetCurrentBsonType();
        // ReSharper disable once SwitchExpressionHandlesSomeKnownEnumValuesWithExceptionInDefault
        int hexCode = type switch {
          BsonType.Double => Convert.ToInt32( context.Reader.ReadDouble() ),
          BsonType.String => int.Parse( context.Reader.ReadString() ),
          BsonType.Int32 => context.Reader.ReadInt32(),
          BsonType.Int64 => Convert.ToInt32( context.Reader.ReadInt64() ),
          _ => throw new ArgumentOutOfRangeException()
        };
        
        

        sbyte q = (sbyte) (hexCode >> 16 & 0xff);
        sbyte r = (sbyte) (hexCode >> 8 & 0xff);
        sbyte s = (sbyte) (hexCode  & 0xff);
        
        return new Hex(q, r, s);
      }

    }

  }
}
