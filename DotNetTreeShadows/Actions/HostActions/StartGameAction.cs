using System.Collections.Generic;
using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.HostActions {
  public class StartGameAction : AHostAction {

    public override GameActionType Type {
      get => GameActionType.StartGame;
    }

    protected override IEnumerable<GameStatus> PermittedDuring { get; } = new[] { GameStatus.Preparing };

    public StartGameAction (Params actionParams) : base( actionParams ) {
      AddValidators( new AActionValidator[] { new GameHasMinimumTwoPlayers( Game ) } );
    }

    protected override void DoAction () {
      if ( !Game.GameOptions.Has( GameOption.AssignTurnOrder ) ) {
        GameOperations.RandomizeTurns( Game );
      }

      Dictionary<string, int> newPlayerBoards = new Dictionary<string, int>();
      
      for (int i = 0; i < Game.TurnOrder.Length; i++) {
        foreach ( (string id, int boardValue) in Game.PlayerBoards ) {
          PlayerBoard newBoard = new PlayerBoard( boardValue ) { TreeType = (TreeType) i };
          newPlayerBoards[id] = newBoard.BoardCode;
        }
      }

      if ( Game.TurnOrder.Length == 2 ) {
        Game.ScoringTokens[4] = new int[0];
      }

      Game.FirstPlayer = Game.TurnOrder[0];
      Game.PlayerBoards = newPlayerBoards;
      Game.Status = GameStatus.PlacingFirstTrees;
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }
    public override GameHub.SessionUpdate SessionUpdate () => new GameHub.SessionUpdate { Game = Game };

    public class Params : AActionParams {

      public Params (ActionRequest request, string playerId, Models.SessionModel.Session? session, Game game) : base( request, playerId ) {
        Session = session;
        Game = game;
      }

    }

  }
}
