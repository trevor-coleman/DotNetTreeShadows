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
      string playerId = context.PlayerId;
      
      PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );
      int targetCode = board.Get( target );
      targetCode = Tile.SetPieceType( targetCode, PieceType.Seed );
      targetCode = Tile.SetTreeType( targetCode, playerBoard.TreeType );
      playerBoard.SpendLight( 1 );
      playerBoard.Pieces( PieceType.Seed).DecreaseAvailable();
      game.SetPlayerBoard( playerId, playerBoard );
      board.Set(target, targetCode);
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Where( t=>t!=origin.HexCode ).Append( origin.HexCode ).ToArray();
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Where( t=>t!=origin.HexCode ).Append( target.HexCode ).ToArray();

      context.Game = game;
      context.Board = board;

      return context;

    }

    protected override ActionContext UndoAction (ActionContext context) {
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      if ( context.Origin == null ) throw new InvalidOperationException("Action context missing required property (Origin)");
      if ( context.Target == null ) throw new InvalidOperationException("Action context missing required property (Target)");
      if ( context.Cost == null ) throw new InvalidOperationException("Action context missing required property (Cost)");
      
      Game game = context.Game;
      Board board = context.Board;
      Hex origin = (Hex)context.Origin;
      Hex target = (Hex)context.Target;
      string playerId = context.PlayerId;
      
      PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );
      playerBoard.RecoverLight( 1 );
      playerBoard.Pieces( PieceType.Seed).IncreaseAvailable();
      game.SetPlayerBoard( playerId, playerBoard );
      board.Set(target, Tile.Empty);
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Where( t=>t!=origin.HexCode ).ToArray();
      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Where( t=>t!=origin.HexCode ).ToArray();

      context.Game = game;
      context.Board = board;

      return context;
    }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.GameIsInPermittedState,
        ValidIf.IsPlayersTurn,
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
