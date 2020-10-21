using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class PlantAction:AAction {
    
    public PlantAction (ActionContext context) { this.ActionContext = context; }
    
    protected override ActionContext DoAction (ActionContext context) {
      
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      if ( context.Origin == null ) throw new InvalidOperationException("Action context missing required property (Origin)");
      if ( context.Target == null ) throw new InvalidOperationException("Action context missing required property (Target)");
      if ( context.Cost == null ) throw new InvalidOperationException("Action context missing required property (Cost)");
      
      Game game = context.Game;
      Board board = context.Board;
      Hex origin = (Hex)context.Origin;
      Hex target = (Hex)context.Target;
      
      PlayerBoard playerBoard = PlayerBoard.Get( game, context.PlayerId );
      int targetCode = board.Get( target );
      targetCode = Tile.SetPieceType( targetCode, PieceType.Seed );
      targetCode = Tile.SetTreeType( targetCode, playerBoard.TreeType );
      playerBoard.SpendLight( (int) context.Cost );
      playerBoard.Pieces( PieceType.Seed).DecreaseAvailable();
      game.SetPlayerBoard( context.PlayerId, playerBoard );
      board.Set(target, targetCode);
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Append( origin ).ToArray();
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Append( target ).ToArray();
      PlayerBoard.Set( game, context.PlayerId, playerBoard );

      context.Game = game;
      context.Board = board;

      return context;

    }
    
    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.PlayerCanAffordCost,
        ValidIf.PlayerHasAvailablePiece,
        ValidIf.OriginPieceTypeIsTree,
        ValidIf.TargetTileIsEmpty,
        ValidIf.TargetIsWithinRangeOfOrigin,
        ValidIf.GrowthInShadowAllowed,
        ValidIf.TargetHasNotBeenActiveThisTurn,
        ValidIf.OriginHasNotBeenActiveThisTurn,
      };

    

  }
}
