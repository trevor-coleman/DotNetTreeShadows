using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class StartGameAction:AAction {
    
    
    public StartGameAction (ActionContext context) { this.ActionContext = context; }

    protected override ActionContext DoAction (ActionContext context) {
      
      if ( !context.Game.GameOptions.Has( GameOption.AssignTurnOrder ) ) {
        context.Game.RandomizeTurns();
      }
      
      if ( context.Game.TurnOrder.Length == 2 ) {
        context.Game.ScoringTokens[4] = new int[0];
      }

      context.Game.FirstPlayer = context.Game.TurnOrder[0];
      context.Game.Status = GameStatus.PlacingFirstTrees;
      
      
      return context;
    }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.GameIsInPermittedState,
        ValidIf.PlayerIsHost,
        ValidIf.GameHasMinimumTwoPlayers,
      };

  }
}
