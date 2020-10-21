using System;
using System.Collections.Generic;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace dotnet_tree_shadows.Models {
  public class BoardConverter : JsonConverter {

    public override void WriteJson (JsonWriter writer, object value, JsonSerializer serializer) {

      Board board = (Board) value;
      
      writer.Formatting = Formatting.Indented;
      
      writer.WriteStartObject();
      writer.WritePropertyName( "Iid" );
      writer.WriteValue( board.Id  );
      writer.WritePropertyName( "tiles" );
      writer.WriteStartObject();
      foreach ( (Hex h, int i) in board.Tiles ) {
        writer.WritePropertyName( h.HexCode.ToString() );
        writer.WriteValue( i );
      }
      writer.WriteEndObject();
      writer.WriteEndObject();
    }

    public override bool CanConvert (Type objectType) =>
      typeof( Board ).GetTypeInfo().IsAssignableFrom( objectType.GetTypeInfo() );

    public override object ReadJson (
        JsonReader reader,
        Type objectType,
        object existingValue,
        JsonSerializer serializer
      ) {
      JObject item = JObject.Load( reader );

        string id = "";
        if ( item["users"] != null ) id = item["users"].Value<string>();

        TileDictionary? tiles = new TileDictionary();
        if ( item["tiles"] != null ) tiles = item["tiles"].Value<TileDictionary>();

        return new Board { Id = id, Tiles = tiles };
      }
  }
}
