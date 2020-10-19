using System;
using System.Collections.Generic;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.Permissions;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Utilities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
  [Serializable]
  public class Board {
    
    
    protected Board (SerializationInfo info, StreamingContext context) {
      Type thisType = this.GetType();
      MemberInfo[] mi = FormatterServices.GetSerializableMembers(thisType, context);
      foreach ( MemberInfo member in mi ) {
        FieldInfo fi = (FieldInfo) member;
        Hex? h = Hex.ParseIndexString( fi.Name );
        if ( h == null ) continue;
        if (Attribute.IsDefined(member, typeof(NonSerializedAttribute))) continue;
        Tiles.Add( h.Value.HexCode, info.GetInt32(fi.Name)  );
      }

      Id = info.GetString( "id" );

    }

    [SecurityPermission(SecurityAction.Demand, SerializationFormatter = true)]
    public void GetObjectData(SerializationInfo info, StreamingContext context)
    {
      info.AddValue( "id", Id );
      foreach ( (int hexCode, int tileCode) in Tiles ) {
        info.AddValue( new Hex(hexCode).IndexString , tileCode );
      }
    }  
    
    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    private Dictionary<int, int> Tiles = new Dictionary<int, int>();
    
    public void Add (Hex h, int i) {
      Tiles.TryAdd( h.HexCode, i );
    }

    public int Get (Hex h) => Tiles[h.HexCode];
    public int Set (Hex h, int value) => Tiles[h.HexCode] = value;

    public bool TryGetValue (in Hex target, out int tileCode) => Tiles.TryGetValue( target.HexCode, out tileCode );

    public int this [int hexCode] {
      get => Tiles[hexCode];
      set => Tiles[hexCode] = value;
    }

  }
}
