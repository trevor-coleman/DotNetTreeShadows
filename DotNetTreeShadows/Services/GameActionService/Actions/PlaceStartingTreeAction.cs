using System;
using System.Collections.Generic;
using System.Resources;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class PlaceStartingTreeAction:AAction {
    
    
    public PlaceStartingTreeAction (ActionContext context) { this.ActionContext = context; }
    
    protected override ActionContext DoAction (ActionContext context) {

      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      if ( context.Origin == null ) throw new InvalidOperationException("Action context missing required property (Origin)");
      
      Game game = context.Game;
      Board board = context.Board;
      Hex origin = (Hex)context.Origin;
      PlayerBoard playerBoard = PlayerBoard.Get( game, context.PlayerId );
      int tileCode = context.Board.Get(origin);
      tileCode = Tile.SetPieceType(tileCode, PieceType.SmallTree );
      TreeType treeType = playerBoard.TreeType;
      tileCode = Tile.SetTreeType( tileCode, treeType );
      playerBoard.Pieces( PieceType.SmallTree ).DecreaseAvailable();
      PlayerBoard.Set( game, context.PlayerId, playerBoard );
      context.Board.Set(origin, tileCode);
      PlayerBoard.Set( game, context.PlayerId, playerBoard );
      
      board = BoardOperations.CastShadow(board, origin ,game.SunPosition  );

      switch ( game.Status ) {
        case GameStatus.PlacingFirstTrees when game.CurrentTurn == game.TurnOrder.Length - 1:
          game.Status = GameStatus.PlacingSecondTrees;
          return context;
        case GameStatus.PlacingFirstTrees:
          game.CurrentTurn++;
          return context;
        case GameStatus.PlacingSecondTrees when game.CurrentTurn == 0:
          foreach ( string id in game.TurnOrder ) {
            PlayerBoard pb = PlayerBoard.Get( game, id );
            pb.Light = (BoardOperations.CountLight( context.Board, pb.TreeType ));
            game.SetPlayerBoard(id, pb );
          }
          game.Status = GameStatus.InProgress;
          return context;
        case GameStatus.PlacingSecondTrees: game.CurrentTurn--;
          return context;
        case GameStatus.Preparing: break;
        case GameStatus.InProgress: break;
        case GameStatus.Ended: break;
        default: throw new ArgumentOutOfRangeException();
      }

      context.Game = game;
      context.Board = board;
      
      return context;
    }
    
    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.GameIsInPermittedState,
        ValidIf.TargetIsValidTile,
        ValidIf.TargetIsOnEdgeOfBoard,
        ValidIf.TargetTileIsEmpty,
        ValidIf.IsPlayersTurn,
      };
    
  }
}
