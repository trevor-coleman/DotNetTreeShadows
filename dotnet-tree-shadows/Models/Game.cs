namespace dotnet_tree_shadows.Models {

    public class Game {
        public int[] TurnOrder { get; set; }
        public int CurrentTurn { get; set; }
        public SunPosition SunPosition { get; set; }
        public Scoring.Stacks ScoreTokenStacks { get; set; }

        public Board Board { get; }

        public Game (IGameData gameData) {
            TurnOrder = gameData.TurnOrder;
            CurrentTurn = gameData.CurrentTurn;
            Board = gameData.Board;
            SunPosition = gameData.SunPosition;
            ScoreTokenStacks = new Scoring.Stacks(gameData.RemainingScoreTokens);
        }

        public Game () {
            Board = Board.New();
            TurnOrder = new[] { 0 };
            ScoreTokenStacks = new Scoring.Stacks();
            SunPosition = SunPosition.NorthWest;
        }

        public Tile GetTileFromHexCoordinates (HexCoordinates hexCoordinates) =>
            Board.TryGetValue( hexCoordinates, out Tile tile )
                ? tile
                : null;
        
    }

}
