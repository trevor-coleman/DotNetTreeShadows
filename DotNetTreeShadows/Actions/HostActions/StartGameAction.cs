using System.Collections.Generic;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;

namespace dotnet_tree_shadows.Models.GameActions.HostActions {
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
        Game.ScoringTokens[4] = new Stack<int>();
      }

      Game.FirstPlayer = Game.TurnOrder[0];
      Game.PlayerBoards = newPlayerBoards;
      Game.Status = GameStatus.PlacingFirstTrees;
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }
    
    public class Params : AActionParams {

      public Params (ActionRequest request, string playerId, SessionModel.Session? session, Game game) : base( request, playerId ) {
        Session = session;
        Game = game;
      }

    }

  }
}
