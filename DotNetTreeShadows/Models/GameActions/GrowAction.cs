using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public class GrowAction : GameAction {
        private readonly HexCoordinates origin;
        private readonly HexCoordinates target;

        public GrowAction (Game game, string playerId, HexCoordinates target) : base( game, playerId ) {
            this.origin = origin;
            this.target = target;

            Game.Board.Tiles.TryGetValue( target, out uint tileCode );
            Tile tile = new Tile( tileCode );

            ActionValidators = new IActionValidator[] {
                                                          new ValidTile( target, nameof(target), game ),
                                                          new OnPlayersTurn( playerId, game ),
                                                          new TileHasNotBeenActiveThisTurn( target, game ),
                                                          new TileBelongsToPlayer( playerId, target, game ),
                                                          new TilePieceTypeIsNot( target, PieceType.LargeTree, game ),
                                                          new TilePieceTypeIsNotNull( target, game ),
                                                          new PieceCanBeReturnedSafely (playerId, target, game),
                                                          new PlayerHasLargerPieceAvailable( playerId, target, game ),
                                                          new PlayerCanAffordLargerPiece (playerId, target, game),
                                                          new GrowthInShadowAllowed( target, game ),
                                                      };
        }

        protected override IEnumerable<IActionValidator> ActionValidators { get; }

        public override void Execute () { }

        public override void Undo () { }
    }

}
