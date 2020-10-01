using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class GameDto {
        public string[] TurnOrder { get; set; } = { };
        public string FirstPlayer { get; set; } = "";
        public Dictionary<string, uint> PlayerBoards { get; set; } = new Dictionary<string, uint>();
        public int CurrentTurn { get; set; } = 0;
        public int Revolution { get; set; } = 0;
        public int Round { get; set; } = 0;
        public SunPosition SunPosition { get; set; } = SunPosition.NorthEast;
        public int[] ScoreTokenStacks { get; set; } = { 8, 8, 5, 3 };
        public BoardDto Board { get; set; } = new BoardDto();
        public bool LongGame { get; set; } = false;
        public bool PreventActionsInShadow { get; set; } = false;
        public HexCoordinates[] TilesActiveThisTurn { get; set; } = { };
        public bool RandomizeTurnOrder { get; set; }
    }
}
