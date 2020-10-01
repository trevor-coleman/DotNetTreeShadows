using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  public class EndTurnAction : ATurnAction {
    public override GameActionType Type {
      get => GameActionType.EndTurn;
    }

    protected override IEnumerable<Game.GameStatus> PermittedDuring { get; } = new []{Game.GameStatus.InProgress };
    public EndTurnAction (Game game, string playerId) : base( game, playerId ) { }

    protected override void DoAction () {
      List<string> turnOrder = Game.TurnOrder;
      Game.CurrentTurn++;
      Game.CurrentTurn %= turnOrder.Count;
      if ( Game.FirstPlayer != Game.CurrentPlayer ) return;
      Game.CurrentTurn++;
      Game.CurrentTurn%= turnOrder.Count;
      Game.FirstPlayer = turnOrder[Game.CurrentTurn];
      Game.Round++;
      Game.Board.SunPosition =
        (SunPosition) (((int) Game.Board.SunPosition + 1) % Enum.GetNames( typeof( SunPosition ) ).Length);

      if ( Game.Board.SunPosition != SunPosition.NorthWest ) return;
      Game.Revolution++;
      if ( Game.Revolution != Game.LengthOfGame ) return;
      Game.End();
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }
  }
}
