using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    
    public class PlayerBoardDTO {
        public int[] ScoringTokens { get; set; }
        public Dictionary<string, PieceCounter> Pieces { get; set; }
    }

    
}
