using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {

    public class Game {
        public Dictionary<string, PlayerBoard> PlayerBoards { get; set; } = new Dictionary<string, PlayerBoard>();
        public Queue<string> TurnOrder { get; set; } = new Queue<string>();
        public Dictionary<string, TreeType> PlayerTreeTypes = new Dictionary<string, TreeType>();
        public string FirstPlayer { get; set; } = "";
        public int CurrentTurn { get; set; } = 0;
        public int Revolution { get; set; } = 0;
        public int Round { get; set; } = 0;
        public bool LongGame { get; set; } = false;
        public bool PreventActionsInShadow { get; set; } = false;
        public Scoring.Stacks ScoreTokenStacks { get; set; } = new Scoring.Stacks();

        public List<HexCoordinates> TilesActiveThisTurn { get; set; } = new List<HexCoordinates>();

        public Board Board { get; } = Board.New();


        public Game () { }

        public Game (string hostId) {
            AddPlayerBoard( hostId );
            TurnOrder.Enqueue( hostId );
        }
        
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

        
        public bool Plant (HexCoordinates origin, HexCoordinates target, PlayerBoard playerBoard, out string message) {
            if ( TilesActiveThisTurn.Contains( origin ) ) {
                message = "Origin tile has already been activated this turn.";
            }

            if ( !Board.Tiles.TryGetValue( target, out Tile? targetTile ) ) {
                message = "Tried to plant with hex that is not in the board.";
                return false;
            }

            if ( PreventActionsInShadow && targetTile.ShadowHeight > 0 ) {
                message = "Planting and growing in shadow are disabled.";
                return false;
            }

            if ( !Board.Tiles.TryGetValue( origin, out Tile? originTile ) ) {
                message = "Tried to plant from hex that is not in the board.";
                return false;
            }

            if ( targetTile.PieceType != null ) {
                message = "Tile is occupied";
                return false;
            }

            if ( originTile.PieceType == null ) {
                message = "Can't plant from empty tile.";
                return false;
            }
            
            if ( target.DistanceTo( origin ) > (int) originTile.PieceType ) {
                message = "Target too far from origin";
                return false;
            }

            if ( !playerBoard.TryHandlePlantSeed( out string playerMessage ) ) {
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
            if ( !Board.Tiles.TryGetValue( target, out Tile? targetTile ) ) {
                message = "Tried to grow with hex that is not in the board.";
                return false;
            }

            

            if ( !targetTile.CanGrow( PreventActionsInShadow, out string? tileFailureReasons ) ) {
                message = $"Tile can't grow tree: {tileFailureReasons}";
                return false;
            }

            if ( targetTile.PieceType == null || targetTile.TreeType == null) {
                message = "Can't grow an empty tile.";
                return false;
            }
            
            PieceType targetPiece = (PieceType) targetTile.PieceType;
            TreeType targetType = (TreeType) targetTile.TreeType;

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

        public bool Collect (
                HexCoordinates target,
                PlayerBoard playerBoard,
                out Scoring.Token? token,
                out string? message
            ) {
            token = null;

            if ( !Board.Tiles.TryGetValue( target, out Tile? targetTile ) ) {
                message = "Tried to grow with hex that is not in the board.";
                return false;
            }

            

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

        public void AddPlayerBoard (string playerId) { PlayerBoards.Add(playerId, new PlayerBoard(playerId) ); }

        public GameDto Dto () {
            List<PlayerBoardDto> playerBoardDtos = new List<PlayerBoardDto>();

            // ReSharper disable once ForeachCanBeConvertedToQueryUsingAnotherGetEnumerator
            foreach ( (_,PlayerBoard playerBoard) in PlayerBoards ) {
                playerBoardDtos.Add( playerBoard.Dto() );
            }
            
            return new GameDto {
                                   TurnOrder = TurnOrder.ToArray(),
                                   FirstPlayer = FirstPlayer,
                                   PlayerBoards = playerBoardDtos.ToArray(),
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
    }
}
