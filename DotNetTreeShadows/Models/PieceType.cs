using System;
using System.Collections;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models {
    [JsonConverter( typeof( StringEnumConverter ) )]
    public enum PieceType {
        Seed,
        SmallTree,
        MediumTree,
        LargeTree
    }
}
