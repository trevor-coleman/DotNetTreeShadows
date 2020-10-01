using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace dotnet_tree_shadows.Models.GameActions {
    public class GrowAction : GameAction {
        private readonly HexCoordinates target;

        public GrowAction (Game game, string playerId, HexCoordinates target) : base( game, playerId ) {
            this.target = target;
            

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

        public override void Execute () {
            Tile tile = Game.Board.GetTileAt( target )!;
            PieceType growingType = (PieceType) tile.PieceType!;
            PieceType grownType = (PieceType) ((int) growingType + 1);
            int price = (int) grownType;
            BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
            
            playerBoard.Pieces( grownType ).DecreaseAvailable();
            tile.PieceType = grownType;
            playerBoard.Pieces( growingType ).IncreaseOnPlayerBoard();
            playerBoard.SpendLight( price );

            Game.Board.SetTileAt(target, tile);

        }

        public override void Undo () {
            Tile tile = Game.Board.GetTileAt( target )!;
            PieceType grownType = (PieceType) tile.PieceType!;
            PieceType growingType = (PieceType) ((int) grownType - 1);
            int price = (int) grownType;
            BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
            
            playerBoard.RecoverLight( price );
            playerBoard.Pieces( growingType ).DecreaseOnPlayerBoard();
            tile.PieceType = growingType;
            playerBoard.Pieces( grownType ).IncreaseAvailable();
            
            Game.Board.SetTileAt( target,tile );
        }
    }

}
