using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class ATurnActionWithOrigin : ATurnAction {

      public Board Board { get; }
      public Hex Origin { get; }

      protected ATurnActionWithOrigin (AActionParams actionParams)  : base( actionParams) {
        Board = actionParams.Board!;
        Origin = (Hex) actionParams.Request.Origin!;
        AddValidators( new AActionValidator[] {
          new ValidTile( Origin ),
          new TileHasNotBeenActiveThisTurn( Origin, Game ), 
          new TileBelongsToPlayer( Origin, PlayerId, Game, Board ), 
        } );
      }
    }
}
