using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;

namespace dotnet_tree_shadows.Models {
  public class BoardSerializer : IBsonSerializer<Dictionary<int, int>>
  {
    public Type ValueType => typeof(Dictionary<int, int> );

    public Dictionary<int, int> Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
      string? value = context.Reader.ReadString();
      return JsonConvert.DeserializeObject<Dictionary<int, int>>( value );
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, Dictionary<int, int> value)
    {
      context.Writer.WriteString(JsonConvert.SerializeObject( value, Formatting.None ));
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
    {
      if (value is Dictionary<int, int> email)
      {
        context.Writer.WriteString(JsonConvert.SerializeObject( value, Formatting.None ));
      }
      else
      {
        throw new NotSupportedException("This is not a Dictionary<int,int>");
      }
    }

    object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
      string? value = context.Reader.ReadString();
      return JsonConvert.DeserializeObject<Dictionary<int, int>>( value );
    }
  }
}
