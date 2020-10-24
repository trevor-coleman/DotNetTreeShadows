using System;
using System.Collections.Generic;
using System.Reflection;
using dotnet_tree_shadows.Models.GameModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace dotnet_tree_shadows.Models {
  public class TokenStacksConverter : JsonConverter {

    public override void WriteJson (JsonWriter writer, object value, JsonSerializer serializer) {

      TokenStacks tokenStacks = (TokenStacks) value;
      
      writer.Formatting = Formatting.Indented;
      
      writer.WriteStartObject();
      for (int i = 1; i <= 4; i++) {
        writer.WritePropertyName( $"{i}" );
        writer.WriteStartArray();
        foreach ( int j in tokenStacks[1] ) {
          writer.WriteValue( j );
        }
        writer.WriteEndArray();
      }
      writer.WriteEndObject();
    }

    public override bool CanConvert (Type objectType) =>
      typeof( TokenStacks ).GetTypeInfo().IsAssignableFrom( objectType.GetTypeInfo() );

    public override object ReadJson (
        JsonReader reader,
        Type objectType,
        object existingValue,
        JsonSerializer serializer
      ) {
      JObject item = JObject.Load( reader );

      TokenStacks tokenStacks =  new TokenStacks();
      
      for (int i = 1; i <= 4; i++) {
        if ( item[$"{i}"] != null ) tokenStacks[i] = item["${i}"]!.Value<int[]>();  
      }

      return tokenStacks;
    }
  }
}
