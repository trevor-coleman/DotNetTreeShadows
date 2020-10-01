using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Models.SessionModels {

    public class Game {
        public Dictionary<string, BitwisePlayerBoard> PlayerBoards { get; set; } = new Dictionary<string, BitwisePlayerBoard>();
        public List<string> TurnOrder { get; set; } = new List<string>();
        public Dictionary<string, TreeType> PlayerTreeTypes = new Dictionary<string, TreeType>();
        public string FirstPlayer { get; set; } = "";
        public int CurrentTurn { get; set; } = 0;
        public int Revolution { get; set; } = 0;
        public int Round { get; set; } = 0;
        public bool LongGame { get; set; } = false;
        public bool PreventActionsInShadow { get; set; } = false;
        public Scoring.Stacks ScoreTokenStacks { get; set; } = new Scoring.Stacks();
        protected GameOptions Options { get; set; }
        public List<HexCoordinates> TilesActiveThisTurn { get; set; } = new List<HexCoordinates>();

        public Board Board { get; } = Board.New();


        public Game () { }

        public Game (string hostId) {
            AddPlayerBoard( hostId );
            TurnOrder.Add( hostId );
        }
        
        public int TotalRounds {
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

        

        public bool Collect (
                HexCoordinates target,
                PlayerBoard playerBoard,
                out Scoring.Token? token,
                out string? message
            ) {
            token = null;
            message = "";
            bool canCollect = true;

            if ( !Board.Tiles.TryGetValue( target, out uint targetTileCode ) ) {
                message += "Tried to grow with hex that is not in the board. ";
                canCollect= false;
            }

            Tile targetTile = new Tile( targetTileCode );
            
            if ( targetTile.PieceType != PieceType.LargeTree ) {
                message += "Tile does not contain a large tree. ";
                canCollect= false;
            }

            if ( targetTile.TreeType != playerBoard.TreeType ) {
                message += "Tree does not belong to player";
                canCollect= false;
            }

            if ( !playerBoard.CanCollect() ) {
                message += "Player can't afford to collect a tree.";
                canCollect= false;
            }

            message = canCollect
                          ? "success"
                          : message;


            if ( !canCollect ) return false;
            
            token = ScoreTokenStacks.Take( 4 - HexCoordinates.Distance( target, HexCoordinates.Zero ) );
            targetTile.TreeType = null;
            targetTile.PieceType = null;
            playerBoard.HandleCollect( token );

            return true;



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
        }
    }
}
