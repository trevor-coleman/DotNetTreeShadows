
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace dotnet_tree_shadows.Models {

    public class Game {
        public Dictionary<string, PlayerBoard> PlayerBoards { get; set; }
        public Queue<string> TurnOrder { get; set; }
        public Dictionary<string, TreeType> PlayerTreeTypes;
        public string? FirstPlayer { get; set; }
        public int CurrentTurn { get; set; }
        public int Revolution { get; set; }
        public int Round { get; set; }
        public int TotalRounds {
            get =>
                LongGame
                    ? 4
                    : 3;
        }

        public struct Options {
            public bool LongGame;
            public bool PreventActionsInShadow;

            public static Options Default {
                get => new Options { LongGame = false, PreventActionsInShadow = false };
            }
        }

        public bool LongGame { get; set; }
        public bool PreventActionsInShadow { get; set; }


        public SunPosition SunPosition { get; set; }
        public Scoring.Stacks ScoreTokenStacks { get; set; }

        public List<HexCoordinates> TilesActiveThisTurn { get; set; }

        public Board Board { get; }
        
        public Game () {
            Board = Board.New();
            TurnOrder = new Queue<string>();
            ScoreTokenStacks = new Scoring.Stacks();
            SunPosition = SunPosition.NorthWest;
            Revolution = 1;
            Round = 1;
            LongGame = false;
            PreventActionsInShadow = false;
        }
        
        public Game (Options options) {
            Board = Board.New();
            TurnOrder = new Queue<string>();
            ScoreTokenStacks = new Scoring.Stacks();
            SunPosition = SunPosition.NorthWest;
            Revolution = 1;
            Round = 1;
            LongGame = options.LongGame;
            PreventActionsInShadow = options.PreventActionsInShadow;
        }
        
        public bool Plant (HexCoordinates origin, HexCoordinates target,  PlayerBoard playerBoard, out string message) {
            if ( TilesActiveThisTurn.Contains( origin ) ) {
                message = "Origin tile has already been activated this turn.";
            }
            
            if(!Board.Tiles.TryGetValue( target, out Tile targetTile )) {
                message = "Tried to plant with hex that is not in the board.";
                return false;
            };

            if ( PreventActionsInShadow && targetTile.ShadowHeight > 0 ) {
                message = "Planting and growing in shadow are disabled.";
                return false;
            }
            
            if(!Board.Tiles.TryGetValue( origin, out Tile originTile )) {
                message = "Tried to plant from hex that is not in the board.";
                return false;
            };
            
            if ( targetTile.PieceType != null ) {
                message = "Tile is occupied";
                return false;
            }

            if ( target.DistanceTo( origin ) > (int) originTile.PieceType ) {
                message = "Target too far from origin";
                return false;
            }

            if (!playerBoard.TryHandlePlantSeed(out string playerMessage) ) {
                message = $"Player can't plant: {playerMessage} ";
                return false;
            }
                
            targetTile.PieceType = PieceType.Seed;
            targetTile.TreeType = playerBoard.TreeType;
            TilesActiveThisTurn.Add( origin );
            TilesActiveThisTurn.Add( target );
            message = "success";
            return true;
        }

        public bool Grow (HexCoordinates target, PlayerBoard playerBoard, out string message) {
            if(!Board.Tiles.TryGetValue( target, out Tile targetTile )) {
                message = "Tried to grow with hex that is not in the board.";
                return false;
            };
            
            if (!targetTile.CanGrow( PreventActionsInShadow, out string tileFailureReasons ) ) {
                message = $"Tile can't grow tree: {tileFailureReasons}";
                return false;
            }

            var targetPiece = (PieceType) targetTile.PieceType;
            var targetType = (TreeType) targetTile.TreeType;

            if ( targetType != playerBoard.TreeType ) {
                message = "Tried to grow another player's tree.";
                return false;
            }
            
            if ( !playerBoard.TryHandleGrowTree( targetPiece, out bool _, out string playerFailureReasons ) ) {
                message = $"Player can't grow tree: {playerFailureReasons}";
                return false;
            }
            
            targetTile.GrowTree();
            
            message = "success";
            return true;
        }

        public bool Collect (HexCoordinates target, PlayerBoard playerBoard, out Scoring.Token? token, out string? message) {
            
            token = null;
            
            if(!Board.Tiles.TryGetValue( target, out Tile targetTile )) {
                message = "Tried to grow with hex that is not in the board.";
                return false;
            };

            if ( !targetTile.HasTree() ) {
                message = "Can't collect from empty tile.";
                return false;
            }
            
            if ( targetTile.PieceType != PieceType.LargeTree ) {
                message = "Tile does not contain a large tree";
                return false;
            }

            if ( targetTile.TreeType != playerBoard.TreeType ) {
                message = "Tree does not belong to player";
                return false;
            }

            if ( !playerBoard.CanCollect() ) {
                message = "Player can't afford to collect a tree.";
                return false;
            }

            token = ScoreTokenStacks.Take( targetTile.Leaves() );
            targetTile.TreeType = null;
            targetTile.PieceType = null;
            playerBoard.HandleCollect( token );

            message = "success";
            return true;
        }

        public void AddPlayerBoard (string playerId) {
            PlayerBoards.Add( playerId, new PlayerBoard() );
        }

        public GameDTO DTO() {
            
            Dictionary<string, PlayerBoardDTO> playerBoardDTOs = new Dictionary<string, PlayerBoardDTO>();
            foreach ( var (playerId, playerBoard) in PlayerBoards ) {
                playerBoardDTOs.Add( playerId, playerBoard.DTO() );
                
            }

            return new GameDTO {
                                   TurnOrder = TurnOrder.ToArray(),
                                   FirstPlayer = FirstPlayer,
                                   PlayerBoards = playerBoardDTOs,
                                   CurrentTurn = CurrentTurn,
                                   Revolution = Revolution,
                                   Round = Round,
                                   SunPosition = SunPosition,
                                   ScoreTokenStacks = ScoreTokenStacks.Remaining,
                                   BoardDTO = Board.DTO(),
                                   LongGame = LongGame,
                                   PreventActionsInShadow = PreventActionsInShadow,
                                   TilesActiveThisTurn = TilesActiveThisTurn.ToArray(),
                               };
        }
    }
}
