using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {
    public interface IGameData {
        public string[] TurnOrder { get; set; }
        public int CurrentTurn { get; set; }
        public Board Board { get; set; }
        public SunPosition SunPosition { get; set; }
        public Dictionary<int, int[]> ScoreTokensRemaining { get; set; }
        public int[] RemainingScoreTokens { get; set; }
        public int Year { get; set; }
        public int Revolution { get; set; }
    }
}
