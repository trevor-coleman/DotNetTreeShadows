using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Models;

namespace dotnet_tree_shadows.Actions {
    public abstract class ATurnActionWithOrigin : ATurnAction {

      public Board Board { get; }
      public Hex Origin { get; }

      protected ATurnActionWithOrigin (AActionParams actionParams)  : base( actionParams) {
        Board = actionParams.Board;
        Origin = (Hex) actionParams.Request.Origin;
        AddValidators( new AActionValidator[] {
          new ValidTile( Origin ),
          new TileHasNotBeenActiveThisTurn( Origin, Game ), 
          new TileBelongsToPlayerOrIsEmpty( Origin, PlayerId, Game, Board ), 
        } );
      }
    }

    public  abstract class ATurnActionOnOwnPiece : ATurnActionWithOrigin {
      protected ATurnActionOnOwnPiece (AActionParams actionParams) : base( actionParams ) {
        AddValidators( new [] {
          new TileBelongsToPlayer( Origin, PlayerId, Game, Board ), 
        } );
      }
      

    }
}
