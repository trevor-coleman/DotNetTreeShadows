using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
    public class PlantAction : ATurnActionWithOrigin {
      public override GameActionType Type {
        get => GameActionType.Plant;
      }

      protected override IEnumerable<Game.GameStatus> PermittedDuring { get; } = new []{ Game.GameStatus.InProgress };
      
        private HexCoordinates Target { get; }
        public TreeType? TreeType { get; }

        public PlantAction (Game game, string playerId, HexCoordinates origin, HexCoordinates target) : base(
                game,
                playerId,
                origin
            ) {
            TreeType = game.PlayerBoards[playerId].TreeType;
            Target = target;

            AddValidators(
                new AActionValidator[] {
                  new PlayerCanAffordCost( playerId, 1, game ),
                  new PlayerHasAvailablePiece( playerId, PieceType.Seed, game ),
                  new PieceTypeIsTree( origin, game ),
                  new TilePieceTypeIs( target, null, game ),
                  new WithinRangeOfOrigin( origin, target, (int) (Game.Board.GetTileAt( origin )?.PieceType ?? 0) ),
                  new GrowthInShadowAllowed( target, game ),
                }
              );
        }


        protected override void DoAction () {
            Tile tile = new Tile( Game.Board.Tiles[Origin] ) { PieceType = PieceType.Seed, TreeType = TreeType };
            Game.PlayerBoards[PlayerId].SpendLight( 1 );
            Game.Board.Tiles[Target] = tile.TileCode;
            Game.TilesActiveThisTurn.Add( Origin );
            Game.TilesActiveThisTurn.Add( Target );
        }

        protected override void UndoAction () {
            Tile tile = new Tile( Game.Board.Tiles[Origin] ) { PieceType = null, TreeType = null };
            Game.PlayerBoards[PlayerId].RecoverLight( 1 );
            Game.Board.Tiles[Target] = tile.TileCode;
            Game.TilesActiveThisTurn.Remove( Origin );
            Game.TilesActiveThisTurn.Remove( Target );
        }
    }

}
