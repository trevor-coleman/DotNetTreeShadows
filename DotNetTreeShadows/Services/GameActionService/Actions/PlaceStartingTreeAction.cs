using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class PlaceStartingTreeAction:AAction {
    
    
    public PlaceStartingTreeAction (ActionContext context) { this.ActionContext = context; }
    
    protected override ActionContext DoAction (ActionContext context) {
      PlayerBoard playerBoard = PlayerBoard.Get( context.Game, context.PlayerId );
      int result = context.Board.Get((Hex)context.Origin);
      result = Tile.SetPieceType(result, PieceType.SmallTree );
      TreeType treeType = playerBoard.TreeType;
      result = Tile.SetTreeType( result, treeType );
      playerBoard.Pieces( PieceType.SmallTree ).DecreaseAvailable();
      PlayerBoard.Set( context.Game, context.PlayerId, playerBoard );
      context.Board.Set((Hex) context.Origin, result);
      PlayerBoard.Set( context.Game, context.PlayerId, playerBoard );

      return context;
    }
    
    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.TargetIsValidTile,
        ValidIf.TileIsEmpty,
        ValidIf.OnPlayersTurn,
      };
    
  }
}
