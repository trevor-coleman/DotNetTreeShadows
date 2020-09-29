using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    
    public class PlayerBoardDto {
        public string PlayerId { get; set; }
        public int[] ScoringTokens { get; set; }
        public Dictionary<string, PieceCounter> Pieces { get; set; }
    }

    
}
