using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  public class EndTurnAction : ATurnAction {
    public override GameActionType Type {
      get => GameActionType.EndTurn;
    }

    protected override IEnumerable<GameStatus> PermittedDuring { get; } = new []{GameStatus.InProgress };
    public EndTurnAction (Params actionParams) : base( actionParams ) { }

    protected override void DoAction () {
      string[] turnOrder = Game.TurnOrder;
      Game.CurrentTurn++;
      Game.CurrentTurn %= turnOrder.Length;
      if ( Game.FirstPlayer != Game.CurrentPlayer ) return;
      Game.CurrentTurn++;
      Game.CurrentTurn%= turnOrder.Length;
      Game.FirstPlayer = turnOrder[Game.CurrentTurn];
      Game.SunPosition =
        (SunPosition) (((int) Game.SunPosition + 1) % Enum.GetNames( typeof( SunPosition ) ).Length);
      if ( Game.SunPosition != SunPosition.NorthWest ) return;
      Game.Revolution++;
      if ( Game.Revolution != Game.LengthOfGame ) return;
      Game.Status = GameStatus.Ended;
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }
    
    public class Params : AActionParams {

      public Params (ActionRequest request, string playerId, Game game) : base( request, playerId ) {
        Game = game; 
      }

    }
    
    public override GameHub.SessionUpdate SessionUpdate () =>
      new GameHub.SessionUpdate() {
        Game = Game,
      };
  }
}
