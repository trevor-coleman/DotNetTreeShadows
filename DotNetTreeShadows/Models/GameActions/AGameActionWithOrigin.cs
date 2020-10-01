using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class AGameActionWithOrigin : AGameAction {
      public HexCoordinates Origin { get; }

      protected AGameActionWithOrigin (Game game, string playerId, HexCoordinates origin) : base( game, playerId )
      {
        Origin = origin;
        AddValidators( new AActionValidator[] {
          new ValidTile( origin, game ),
          new TileHasNotBeenActiveThisTurn( origin, game ), 
          new TileBelongsToPlayer( origin, playerId, game ), 
        } );
      }
    }
}
