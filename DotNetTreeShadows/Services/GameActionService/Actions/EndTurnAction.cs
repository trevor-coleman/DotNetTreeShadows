using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Shadow;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class EndTurnAction : AAction {
    
    
    public EndTurnAction (ActionContext context) { this.ActionContext = context; }

    protected override ActionContext DoAction (ActionContext context) {
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      GameActionData actionData = MakeActionData(context);

      Game game = context.Game;
      Board board = context.Board;
      
      string[] turnOrder = game.TurnOrder;
      game.CurrentTurn++;
      game.CurrentTurn %= turnOrder.Length;
      game.turnCount++;
      game.TilesActiveThisTurn = new int[0];
      
      if ( game.FirstPlayer != game.CurrentPlayer ) {
        game.AddGameAction( actionData);
        return context;
      }
      game.CurrentTurn++;
      game.CurrentTurn%= turnOrder.Length;
      game.FirstPlayer = turnOrder[game.CurrentTurn];
      game.SunPosition =
        (SunPosition) (((int) game.SunPosition + 1) % Enum.GetNames( typeof( SunPosition ) ).Length);

      if ( game.SunPosition == SunPosition.NorthWest ) {
        game.Revolution++;
        if ( game.Revolution == game.LengthOfGame ) {
          
          game.Status = GameStatus.Ended;
          game.AddGameAction( actionData);
          context.Game = game;
          context.Board = board;
          return context;
        }
      }
      
      board.Tiles = Shadow.UpdateAllShadows( board, game.SunPosition );
      foreach (string playerId in game.TurnOrder ) {
        PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );
        int earnedLight = BoardOperations.CountLight( board, playerBoard.TreeType );
        Console.WriteLine($"{playerId} - {earnedLight}");
        playerBoard.RecoverLight( earnedLight );
        game.SetPlayerBoard( playerId, playerBoard );
      }
      game.AddGameAction( actionData);
      return context;
    }

    protected override ActionContext UndoAction (ActionContext context) => context;
    protected override GameActionData MakeActionData (ActionContext context) => new GameActionData(context.PlayerId, GameActionType.EndTurn, null, null, null);

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.IsPlayersTurn,
        ValidIf.GameIsInPermittedState,
      };
    
    protected override IEnumerable<Func<ActionContext, bool>> UndoValidators { get; } =
      new Func<ActionContext, bool> [] {
        _=>false, 
      };
    

  }
}
