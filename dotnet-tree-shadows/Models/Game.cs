using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {

    public class Game {
        public Queue<string> TurnOrder { get; set; }
        public string? FirstPlayer { get; set; }
        public int CurrentTurn { get; set; }
        public int Revolution { get; set; }
        public int Round { get; set; }
        public SunPosition SunPosition { get; set; }
        public Scoring.Stacks ScoreTokenStacks { get; set; }

        public Board Board { get; }

        public Game (IGameData gameData) {
            TurnOrder = new Queue<string>(gameData.TurnOrder);
            FirstPlayer = null;
            CurrentTurn = gameData.CurrentTurn;
            Board = gameData.Board;
            SunPosition = gameData.SunPosition;
            ScoreTokenStacks = new Scoring.Stacks(gameData.RemainingScoreTokens);
            Round = gameData.Revolution;
            Revolution = gameData.Revolution;
        }

        public Game () {
            Board = Board.New();
            TurnOrder = new Queue<string>();
            ScoreTokenStacks = new Scoring.Stacks();
            SunPosition = SunPosition.NorthWest;
            Revolution = 1;
            Round = 1;
        }

        public Tile GetTileFromHexCoordinates (HexCoordinates hexCoordinates) =>
            Board.TryGetValue( hexCoordinates, out Tile tile )
                ? tile
                : null;
        
    }

}
