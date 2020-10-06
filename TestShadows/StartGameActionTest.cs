using System;
using System.Linq;
using System.Security.Cryptography;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameActions.HostActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Session;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using NUnit.Framework;

namespace TestShadows {
  [TestFixture]
  public class StartGameActionTest {
    private Game game;
    private Session session;
    private ActionRequest actionRequest = new ActionRequest() { Type = GameActionType.StartGame };
    private StartGameAction.Params actionParams {
      get => new StartGameAction.Params( actionRequest, playerId, session, game );
    }

    private StartGameAction action {
      get => new StartGameAction( actionParams );
    }

    private string sessionId;
    private string playerId;
    
    
    [SetUp]
    public void Setup () {

      sessionId = "sessionId";
      session = SessionOperations.Create( "player0", "Player0Name" );
      session.Id = sessionId;
      
      playerId = "player0";

      game = new Game { Id = sessionId };
      GameOperations.AddPlayer( game, "player0" );
      GameOperations.AddPlayer( game, "player1" );
      GameOperations.AddPlayer( game, "player2" );
      GameOperations.AddPlayer( game, "player3" );
      game.FirstPlayer = "player0";
      game.Status = GameStatus.InProgress;

      
    }

    [Test]
    public void ShouldFailIfFewerThanTwoPlayers () {
      game = new Game();
      GameOperations.AddPlayer( game, "player0" );
      bool result = action.Execute( out string? failureMessage );
      Assert.IsFalse( result, "GameStartAction.Execute() returned true. " );
      Assert.IsNotNull( failureMessage, "GameStartAction.Execute() returned a null failureMessage " );
    }

    [Test] public void ShouldShuffleTurnOrderWithDefaultOptions () {
      int count = 0;
      for (int i = 0; i < 100; i++) {
        string[] turnOrder = game.TurnOrder.ToArray();
        action.Execute( out _ );
        bool sameOrder = !turnOrder.Where( (t, j) => game.TurnOrder[j] != t ).Any();
        if ( sameOrder ) count++;
      }

      Assert.Less( count, 10, $"TurnOrder was the same after {count} / 100 shuffles -- expected ~{100/(4*3*2)} times -- (could be bad luck)"  );

    }
    
    [Test] public void ShouldNotShuffleTurnOrderIfAssignTurnOrderOptionIsSet () {
      int count = 0;
      for (int i = 0; i < 10; i++) {
        game.GameOptions.Add( GameOption.AssignTurnOrder );
        string[] turnOrder = game.TurnOrder.ToArray();
        action.Execute( out _ );
        bool sameOrder = !turnOrder.Where( (t, j) => game.TurnOrder[j] != t ).Any();
        if ( sameOrder ) count++;
      }

      Assert.AreEqual( 10, count, $"TurnOrder was the same after {count} / 10 shuffles -- expected 10 times."  );

    }
  }
}
