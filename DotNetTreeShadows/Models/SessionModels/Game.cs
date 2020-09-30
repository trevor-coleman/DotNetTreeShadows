using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {

    public class Game {
        public Dictionary<string, PlayerBoard> PlayerBoards { get; set; } = new Dictionary<string, PlayerBoard>();
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

        
        public bool Plant (HexCoordinates origin, HexCoordinates target, PlayerBoard playerBoard, out string message) {
            if ( TilesActiveThisTurn.Contains( origin ) ) {
                message = "Origin tile has already been activated this turn.";
            }

            if ( !Board.Tiles.TryGetValue( target, out uint targetTileCode ) ) {
                message = "Tried to plant with hex that is not in the board.";
                return false;
            }
            
            Tile targetTile = new Tile(targetTileCode);

            if ( PreventActionsInShadow && targetTile.ShadowHeight > 0 ) {
                message = "Planting and growing in shadow are disabled.";
                return false;
            }

            if ( !Board.Tiles.TryGetValue( origin, out uint originTileCode ) ) {
                message = "Tried to plant from hex that is not in the board.";
                return false;
            }

            Tile originTile = new Tile(originTileCode);
            
            
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
            
            GrowActionValidator growActionValidator = new GrowActionValidator(Options, playerBoard, Board);
            
            if ( !growActionValidator.CanGrow( target, out string tileFailureReasons, out Tile? targetTile ) ) {
                message = $"Unable to Grow: {tileFailureReasons}";
                return false;
            }
            
            

            targetTile!.GrowTree();

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

        public void AddPlayer (string playerId) {
            TurnOrder.Add( playerId );
            AddPlayerBoard( playerId );
        }
    }
}
