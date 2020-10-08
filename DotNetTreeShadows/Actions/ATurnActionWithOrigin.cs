using System.Collections.Generic;
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
        Origin = (Hex) actionParams.Request.OriginHex;
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
