using System;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using NUnit.Framework;

namespace TestShadows {
  [TestFixture]
  public class EndTurnActionTest {
    private Game game;

    [SetUp]
    public void Setup () {
      game = new Game( "player0" );
      game.AddPlayer( "player1" );
      game.AddPlayer( "player2" );
      game.AddPlayer( "player3" );
      game.Status = Game.GameStatus.InProgress;
    }

    [Test] public void ShouldFailIfNotPlayersTurn () {
      EndTurnAction endTurnAction = new EndTurnAction( game, "player1" );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result );
      Assert.IsNotNull( failureMessage );
    }

    [Test] public void ShouldFailIfPlayerIsNotInGame () {
      EndTurnAction endTurnAction = new EndTurnAction( game, "randomInterloper" );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result );
      Assert.IsNotNull( failureMessage );
    }

    [Test]
    public void ShouldAdvanceOnlyCurrentTurnOnNormalEndTurn () {
      EndTurnAction endTurnAction = new EndTurnAction( game, "player0" );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.AreEqual( 1, game.CurrentTurn, 1 );
      Assert.AreEqual( 0, game.Round, 0 );
      Assert.AreEqual( 0, game.Revolution, 0 );
      Assert.AreEqual( SunPosition.NorthWest, game.Board.SunPosition );
    }

    [Test]
    public void ShouldAdvanceRoundWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];

      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );

      Assert.AreEqual( 1, game.Round );
    }

    [Test]
    public void ShouldAdvanceSunWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];

      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );

      Assert.AreEqual( SunPosition.NorthEast, game.Board.SunPosition );
    }

    [Test]
    public void ShouldSkipNextPlayerWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];
      string nextPlayer = game.TurnOrder[2];

      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );

      Assert.AreEqual( nextPlayer, game.FirstPlayer );
    }

    [Test]
    public void ShouldAdvanceRevolutionWhenSunReachesNorthWest () {
      game.Board.SunPosition = SunPosition.West;
      game.FirstPlayer = game.TurnOrder[game.CurrentTurn + 1];
      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.AreEqual( 1, game.Revolution );
    }

    [Test]
    public void ShouldEndGameAtEndOfLastRevolution () {
      game.Revolution = game.LengthOfGame - 1;
      game.FirstPlayer = game.TurnOrder[1];
      game.Board.SunPosition = SunPosition.West;
      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.AreEqual( Game.GameStatus.Ended, game.Status );
    }

    [Test] 
    void ShouldFailIfGameStatusIsPreparing () {
      game.Status = Game.GameStatus.Preparing;
      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result, "EndTurnAction Succeeded when status was Preparing;" );
    }
    
    [Test] 
    void ShouldFailIfGameHasEnded () {
      game.Status = Game.GameStatus.Ended;
      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result, "EndTurnAction Succeeded when status was Ended;" );
    }
    
  }
}
