using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public class PlantAction : GameAction {

        public HexCoordinates Origin { get; }
        private HexCoordinates Target { get; }
        public TreeType? TreeType { get; }

        public PlantAction (Game game, string playerId, HexCoordinates origin, HexCoordinates target) : base(
                game,
                playerId
            ) {
            TreeType = game.PlayerBoards[playerId].TreeType;
            Target = target;
            Origin = origin;

            ActionValidators = new IActionValidator[] {
                                                new OnPlayersTurn( playerId, game ),
                                                new PlayerCanAffordCost( playerId, 1, game ),
                                                new PlayerHasAvailablePiece( playerId, PieceType.Seed, game ),
                                                new ValidTile( target, "target", game ),
                                                new ValidTile( origin, "origin", game ),
                                                new TileHasNotBeenActiveThisTurn( origin, game ),
                                                new PieceTypeIsTree( origin, game ),
                                                new TilePieceTypeIsNull( target, game ),
                                                new WithinRangeOfOrigin(
                                                        origin,
                                                        target,
                                                        (int) (Game.Board.TileAt( origin )?.PieceType ?? 0)
                                                    ),
                                                new GrowthInShadowAllowed( target, game ),
                                            };
        }

        protected override IEnumerable<IActionValidator> ActionValidators { get; }

        public override void Execute () {
            Tile tile = new Tile( Game.Board.Tiles[Origin] ) { PieceType = PieceType.Seed, TreeType = TreeType };

            Game.PlayerBoards[PlayerId].SpendLight( 1 );
            Game.Board.Tiles[Target] = tile.TileCode;
            Game.TilesActiveThisTurn.Add( Origin );
            Game.TilesActiveThisTurn.Add( Target );
        }

        public override void Undo () {
            Tile tile = new Tile( Game.Board.Tiles[Origin] ) { PieceType = null, TreeType = null };

            Game.PlayerBoards[PlayerId].RecoverLight( 1 );
            Game.Board.Tiles[Target] = tile.TileCode;
            Game.TilesActiveThisTurn.Remove( Origin );
            Game.TilesActiveThisTurn.Remove( Target );
        }
    }

}
