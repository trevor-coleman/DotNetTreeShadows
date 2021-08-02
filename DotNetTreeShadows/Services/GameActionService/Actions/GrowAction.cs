using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Shadow;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class GrowAction : AAction {

    public GrowAction (ActionContext actionContext) { ActionContext = actionContext; }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } = new Func<ActionContext, bool>[] {
      ValidIf.GameIsInPermittedState,
      ValidIf.IsPlayersTurn,
      ValidIf.TileBelongsToPlayer,
      ValidIf.TargetTileIsNotEmpty,
      ValidIf.TargetIsNotALargeTree,
      ValidIf.PlayerHasLargerPieceAvailable,
      ValidIf.PlayerCanAffordToGrow,
      ValidIf.TargetHasNotBeenActiveThisTurn,
      ValidIf.GrowthInShadowAllowed
    };
    
    protected override IEnumerable<Func<ActionContext, bool>> UndoValidators { get; } = new Func<ActionContext, bool>[] {
      ValidIf.GameIsInPermittedState,
      ValidIf.IsPlayersTurn,
      ValidIf.TileBelongsToPlayer,
      ValidIf.TargetTileIsNotEmpty,
      ValidIf.TargetIsNotSeed,
    };

    protected override ActionContext DoAction (ActionContext context) {
      if ( context.Game == null )
        throw new InvalidOperationException( "Action context missing required property (Game)" );

      if ( context.Board == null )
        throw new InvalidOperationException( "Action context missing required property (Board)" );

      if ( context.Origin == null )
        throw new InvalidOperationException( "Action context missing required property (Origin)" );

      if ( context.Target == null )
        throw new InvalidOperationException( "Action context missing required property (Target)" );

      GameActionData actionData = MakeActionData( context );

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
      board.Tiles = Shadow.UpdateAllShadows( board, game.SunPosition );

      game.TilesActiveThisTurn =
        game.TilesActiveThisTurn.Where( h => h != origin.HexCode ).Append( origin.HexCode ).ToArray();

      game.AddGameAction( actionData );
      context.Game = game;
      context.Board = board;

      return context;
    }

    protected override ActionContext UndoAction (ActionContext context) {
      if ( context.Game == null )
        throw new InvalidOperationException( "Action context missing required property (Game)" );

      if ( context.Board == null )
        throw new InvalidOperationException( "Action context missing required property (Board)" );

      if ( context.Origin == null )
        throw new InvalidOperationException( "Action context missing required property (Origin)" );

      if ( context.Target == null )
        throw new InvalidOperationException( "Action context missing required property (Target)" );
      
      

      Game game = context.Game;
      Board board = context.Board;
      Hex origin = context.Origin.Value;
      string playerId = context.PlayerId;

      int tileCode = board[origin];
      int grownTypeCode = (int) (Tile.GetPieceType( tileCode ) ?? 0);
      int growingTypeCode = grownTypeCode - 1;
      int price = grownTypeCode;
      
      PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );

      playerBoard.Pieces( (PieceType) grownTypeCode ).IncreaseAvailable();
      int resultingTile = Tile.SetPieceType( tileCode, (PieceType) growingTypeCode );
      if ( game.TryGetLastAction( out GameActionData? data ) && data!.Discarded == false ) {
        playerBoard.Pieces( (PieceType) growingTypeCode ).DecreaseOnPlayerBoard();
      } 
      
      playerBoard.RecoverLight( price );
      game.SetPlayerBoard( playerId, playerBoard );
      board[origin] = resultingTile;
      board.Tiles = Shadow.UpdateAllShadows( board, game.SunPosition );

      game.TilesActiveThisTurn =
        game.TilesActiveThisTurn.Where( h => h != origin.HexCode ).ToArray();

      
      
      context.Game = game;
      context.Board = board;

      return context;
    }

    protected override GameActionData MakeActionData (ActionContext context) {
      PieceType growingType = (PieceType) Tile.GetPieceType( context.Board![(Hex) context.Origin!] )!; 
      PieceType grownType = (PieceType) ((int)growingType + 1); 
      PlayerBoard playerBoard = PlayerBoard.Get( context.Game!, context.PlayerId );
      bool discarded = !playerBoard.Pieces( growingType ).CanReturnSafely();
      return new GameActionData(
          context.PlayerId,
          GameActionType.Grow,
          context.Origin!.Value.HexCode,
          grownType,
          discarded
        );
    }

  }
}
