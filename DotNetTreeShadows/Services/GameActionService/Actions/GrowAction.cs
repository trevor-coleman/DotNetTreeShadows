using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class GrowAction:AAction {

    public GrowAction (ActionContext actionContext) { ActionContext = actionContext; }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool>[] {
        ValidIf.GameIsInPermittedState,
        ValidIf.IsPlayersTurn,
        ValidIf.TileBelongsToPlayer,
        ValidIf.TargetTileIsNotEmpty,
        ValidIf.TargetIsNotALargeTree,
        ValidIf.PlayerHasLargerPieceAvailable,
        ValidIf.PlayerCanAffordToGrow,
        ValidIf.TargetHasNotBeenActiveThisTurn,
        ValidIf.GrowthInShadowAllowed,
      };



    protected override ActionContext DoAction (ActionContext context) {
      
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      if ( context.Origin == null ) throw new InvalidOperationException("Action context missing required property (Origin)");
      if ( context.Target == null ) throw new InvalidOperationException("Action context missing required property (Target)");

      Game game = context.Game;
      Board board = context.Board;
      Hex origin = context.Origin.Value;
      string playerId = context.PlayerId;
      
      int tileCode = board[origin];
      int growingTypeCode = (int) (Tile.GetPieceType( tileCode ) ?? 0);
      int grownTypeCode = growingTypeCode + 1;
      int price = grownTypeCode;
      PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );

      playerBoard.Pieces( (PieceType) grownTypeCode ).DecreaseAvailable();
      int resultingTile = Tile.SetPieceType( tileCode, (PieceType) grownTypeCode );
      playerBoard.Pieces( (PieceType) growingTypeCode ).IncreaseOnPlayerBoard();
      playerBoard.SpendLight( price );
      game.SetPlayerBoard( playerId, playerBoard );
      board[origin] = resultingTile;

      game.TilesActiveThisTurn = game.TilesActiveThisTurn.Where( h => h != origin.HexCode ).Append( origin.HexCode ).ToArray();
      
      context.Game = game;
      context.Board = board;

      return context;
    }

  }
}
