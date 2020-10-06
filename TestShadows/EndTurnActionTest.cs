using System;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using NUnit.Framework;

namespace TestShadows {
  [TestFixture]
  public class EndTurnActionTest {

    private Game game;
    private EndTurnAction action;
    private ActionRequest actionRequest;
    private EndTurnAction.Params actionParams;

    [SetUp]
    public void Setup () {
      game = new Game();
      GameOperations.AddPlayer( game, "player0" );
      GameOperations.AddPlayer( game, "player1" );
      GameOperations.AddPlayer( game, "player2" );
      GameOperations.AddPlayer( game, "player3" );
      game.FirstPlayer = "player0";
      game.Status = GameStatus.InProgress;

      actionRequest = new ActionRequest { Type = GameActionType.EndTurn };

      EndTurnAction.Params endTurnActionParams = new EndTurnAction.Params( actionRequest, "player0", game );

      EndTurnAction endTurnAction = new EndTurnAction( actionParams );
    }

    [Test] public void ShouldFailIfNotPlayersTurn () {
      bool result = action.Execute( out string? failureMessage );
      Assert.IsFalse( result );
      Assert.IsNotNull( failureMessage );
    }

    [Test] public void ShouldFailIfPlayerIsNotInGame () {
      EndTurnAction endTurnAction =
        new EndTurnAction( new EndTurnAction.Params( actionRequest, "randomInterloper", game ) );

      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result );
      Assert.IsNotNull( failureMessage );
    }

    [Test]
    public void ShouldAdvanceOnlyCurrentTurnOnNormalEndTurn () {
      bool result = action.Execute( out string? failureMessage );
      Assert.AreEqual( 1, game.CurrentTurn, 1 );
      Assert.AreEqual( 0, game.Revolution, 0 );
      Assert.AreEqual( SunPosition.NorthWest, game.SunPosition );
    }
    
    [Test]
    public void ShouldAdvanceSunWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];
      
      bool result = action.Execute( out string? failureMessage );

      Assert.AreEqual( SunPosition.NorthEast, game.SunPosition );
    }

    [Test]
    public void ShouldSkipNextPlayerWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];
      string nextPlayer = game.TurnOrder[2];
      
      bool result = action.Execute( out string? failureMessage );

      Assert.AreEqual( nextPlayer, game.FirstPlayer );
    }

    [Test]
    public void ShouldAdvanceRevolutionWhenSunReachesNorthWest () {
      game.SunPosition = SunPosition.West;
      game.FirstPlayer = game.TurnOrder[game.CurrentTurn + 1];
      bool result = action.Execute( out string? failureMessage );
      Assert.AreEqual( 1, game.Revolution );
    }

    [Test]
    public void ShouldEndGameAtEndOfLastRevolution () {
      game.Revolution = game.LengthOfGame - 1;
      game.FirstPlayer = game.TurnOrder[1];
      game.SunPosition = SunPosition.West;
      bool result = action.Execute( out string? failureMessage );
      Assert.AreEqual( GameStatus.Ended, game.Status );
    }

    [Test]
    void ShouldFailIfGameStatusIsPreparing () {
      game.Status = GameStatus.Preparing;
      bool result = action.Execute( out string? failureMessage );
      Assert.IsFalse( result, "EndTurnAction Succeeded when status was Preparing;" );
    }

    [Test]
    void ShouldFailIfGameHasEnded () {
      game.Status = GameStatus.Ended;
      bool result = action.Execute( out string? failureMessage );
      Assert.IsFalse( result, "EndTurnAction Succeeded when status was Ended;" );
    }

  }
}
