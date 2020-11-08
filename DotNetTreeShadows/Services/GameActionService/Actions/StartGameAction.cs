using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class StartGameAction : AAction {

    public StartGameAction (ActionContext context) { ActionContext = context; }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } = new Func<ActionContext, bool>[] {
      ValidIf.GameIsInPermittedState, ValidIf.PlayerIsHost, ValidIf.GameHasMinimumTwoPlayers
    };

    protected override IEnumerable<Func<ActionContext, bool>> UndoValidators { get; } =
      new Func<ActionContext, bool>[] { _ => false };

    protected override ActionContext DoAction (ActionContext context) {
      if ( context.Game == null )
        throw new InvalidOperationException( "Action context missing required property (Game)" );

      GameActionData actionData = MakeActionData( context );

      Game game = context.Game;
      if ( !game.GameOptions.Contains( GameOption.AssignTurnOrder ) ) game.RandomizeTurns();

      if ( game.TurnOrder.Length == 2 ) game.ScoringTokens[4] = new int[0];

      game.FirstPlayer = game.TurnOrder[0];
      game.Status = GameStatus.PlacingFirstTrees;

      game.AddGameAction( actionData );

      return context;
    }

    protected override ActionContext UndoAction (ActionContext context) => context;

    protected override GameActionData MakeActionData (ActionContext context) =>
      new GameActionData( context.PlayerId, context.GameActionType, null, null, null );

  }
}
