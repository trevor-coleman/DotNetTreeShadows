using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace dotnet_tree_shadows.Models.SessionModels {

    public class Game {
        public Dictionary<string, BitwisePlayerBoard> PlayerBoards { get; set; } = new Dictionary<string, BitwisePlayerBoard>();
        public List<string> TurnOrder { get; set; } = new List<string>();
        public Dictionary<string, TreeType> PlayerTreeTypes = new Dictionary<string, TreeType>();
        public string FirstPlayer { get; set; } = "";
        public int CurrentTurn { get; set; } = 0;
        public string CurrentPlayer {
          get => TurnOrder[CurrentTurn];
        }
        public int Revolution { get; set; } = 0;
        public int Round { get; set; } = 0;
        public bool LongGame { get; set; } = false;
        public bool PreventActionsInShadow { get; set; } = false;
        public Dictionary<string, Scoring.PlayerScore> PlayerScores = new Dictionary<string, Scoring.PlayerScore>();
        public Scoring.Stacks ScoreTokenStacks { get; set; } = new Scoring.Stacks();
        protected GameOptions Options { get; set; }
        public List<HexCoordinates> TilesActiveThisTurn { get; set; } = new List<HexCoordinates>();

        public Board Board { get; } = Board.New();


        public Game () { }

        public Game (string hostId) {
            AddPlayer( hostId );
            FirstPlayer = hostId;
        }

        public void Start() {
          Random random = new Random();
          int n = TurnOrder.Count;
          string[] array = TurnOrder.ToArray();
          while (n > 1) 
          {
            int k = random.Next(n--);
            string temp = array[n];
            array[n] = array[k];
            array[k] = temp;
          }
          TurnOrder = array.ToList();
          FirstPlayer = TurnOrder[0];
        }
        
        public int LengthOfGame {
            get =>
                LongGame
                    ? 4
                    : 3;
        }

        public struct GameOptions {
            public bool LongGame;
            public bool PreventActionsInShadow;

            public GameOptions (bool preventActionsInShadow, bool longGame) {
                PreventActionsInShadow = preventActionsInShadow;
                LongGame = longGame;
            }

            public static GameOptions Default {
                get => new GameOptions { LongGame = false, PreventActionsInShadow = false };
            }
        }
      

        public void AddPlayerBoard (string playerId) { PlayerBoards.Add(playerId, new BitwisePlayerBoard() ); }
        
        
        public GameDto Dto () {

            Dictionary<string, uint> playerBoardDtos = new Dictionary<string, uint>();
            // ReSharper disable once ForeachCanBeConvertedToQueryUsingAnotherGetEnumerator
            foreach ( (string playerId,BitwisePlayerBoard playerBoard) in PlayerBoards ) {
                playerBoardDtos.Add( playerId, playerBoard.BoardCode );
            }
            
            return new GameDto {
                                   TurnOrder = TurnOrder.ToArray(),
                                   FirstPlayer = FirstPlayer,
                                   PlayerBoards = playerBoardDtos,
                                   CurrentTurn = CurrentTurn,
                                   Revolution = Revolution,
                                   Round = Round,
                                   ScoreTokenStacks = ScoreTokenStacks.Remaining,
                                   Board = Board.Dto(),
                                   LongGame = LongGame,
                                   PreventActionsInShadow = PreventActionsInShadow,
                                   TilesActiveThisTurn = TilesActiveThisTurn.ToArray(),
                               };
        }

        public void AddPlayer (string playerId) {
            TurnOrder.Add( playerId );
            AddPlayerBoard( playerId );
            AddPlayerScore(playerId );
        }

        private void AddPlayerScore (string playerId) => PlayerScores.TryAdd( playerId, new Scoring.PlayerScore() );
        public void End () { throw new System.NotImplementedException(); }
    }
}
