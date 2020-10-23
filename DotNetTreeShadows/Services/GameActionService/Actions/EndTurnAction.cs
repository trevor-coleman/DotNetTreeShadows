using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Shadow;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class EndTurnAction : AAction {
    
    
    public EndTurnAction (ActionContext context) { this.ActionContext = context; }

    protected override ActionContext DoAction (ActionContext context) {
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      
      Game game = context.Game;
      Board board = context.Board;
      
      string[] turnOrder = game.TurnOrder;
      game.CurrentTurn++;
      game.CurrentTurn %= turnOrder.Length;
      game.turnCount++;
      game.TilesActiveThisTurn = new int[0];
      if ( game.FirstPlayer != game.CurrentPlayer ) return context;
      game.CurrentTurn++;
      game.CurrentTurn%= turnOrder.Length;
      game.FirstPlayer = turnOrder[game.CurrentTurn];
      game.SunPosition =
        (SunPosition) (((int) game.SunPosition + 1) % Enum.GetNames( typeof( SunPosition ) ).Length);
      board.Tiles = Shadow.UpdateAllShadows( board, game.SunPosition );
      foreach (string playerId in game.TurnOrder ) {
        PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );
        int earnedLight = BoardOperations.CountLight( board, playerBoard.TreeType );
        Console.WriteLine($"{playerId} - {earnedLight}");
        playerBoard.RecoverLight( earnedLight );
        game.SetPlayerBoard( playerId, playerBoard );
      }
      
      if ( game.SunPosition != SunPosition.NorthWest ) return context;
      game.Revolution++;
      if ( game.Revolution != game.LengthOfGame ) return context;
      
      game.Status = GameStatus.Ended;

      context.Game = game;
      context.Board = board;
      
      return context;
    }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.IsPlayersTurn,
        ValidIf.GameIsInPermittedState,
      };
    

  }
}
