using System;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.SessionModels;
using NUnit.Framework;

namespace TestShadows {
  [TestFixture]
  public class EndTurnActionTest {
    private Game game;

    [SetUp]
    public void Setup () {
      game = new Game("player0");
      game.AddPlayer( "player1" );
      game.AddPlayer( "player2" );
      game.AddPlayer( "player3" );
    }

    [Test] public void ShouldFailIfNotPlayersTurn () {
      Assert.AreNotEqual( "player1", game.CurrentPlayer );
      EndTurnAction endTurnAction = new EndTurnAction( game, "player1" );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsFalse( result );
      Assert.IsNotNull( failureMessage );
    }

    [Test]
    public void ShouldOnlyAdvanceCurrentTurnOnNormalEndTurn () {
      Assert.AreEqual( 0, game.CurrentTurn );
      Assert.AreEqual( 0, game.Round );
      Assert.AreEqual( 0, game.Revolution);
      Assert.AreEqual( SunPosition.NorthWest, game.Board.SunPosition );
      
      EndTurnAction endTurnAction = new EndTurnAction(game, "player0");
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsTrue( result );
      Assert.IsNull( failureMessage );
      Assert.AreEqual( 1, game.CurrentTurn, 1 );
      Assert.AreEqual( 0, game.Round, 0 );
      Assert.AreEqual( 0, game.Revolution, 0 );
      Assert.AreEqual( SunPosition.NorthWest, game.Board.SunPosition );
      
    }
    
    [Test]
    public void ShouldEndRoundWhenNextPlayerIsFirstPlayer () {
      game.CurrentTurn = 0;
      game.FirstPlayer = game.TurnOrder[1];
      
      Console.WriteLine(game.FirstPlayer);
      Console.WriteLine(game.CurrentPlayer);
      
      Assert.AreEqual( 0, game.CurrentTurn );
      Assert.AreEqual( "player0", game.CurrentPlayer );
      Assert.AreEqual( "player1", game.FirstPlayer );
      Assert.AreEqual( 0, game.Round );
      Assert.AreEqual( 0, game.Revolution );
      Assert.AreEqual( SunPosition.NorthWest, game.Board.SunPosition );
      
      EndTurnAction endTurnAction = new EndTurnAction(game, game.CurrentPlayer);
      bool result = endTurnAction.Execute(out string? failureMessage);
      
      Assert.IsTrue( result );
      Assert.IsNull( failureMessage );
      Assert.AreEqual( 2, game.CurrentTurn );
      Assert.AreEqual( "player2", game.FirstPlayer );
      Assert.AreEqual( 1, game.Round );
      Assert.AreEqual( 0, game.Revolution );
      Assert.AreEqual( SunPosition.NorthEast, game.Board.SunPosition );
    }

    [Test]
    public void ShouldAdvanceRevolutionWhenSunReachesNorthWest () {
      game.Board.SunPosition = SunPosition.West;
      game.FirstPlayer = game.TurnOrder[game.CurrentTurn + 1];
      EndTurnAction endTurnAction = new EndTurnAction( game, game.CurrentPlayer);
      Assert.AreEqual( 0, game.Revolution );
      bool result = endTurnAction.Execute( out string? failureMessage );
      Assert.IsNull( failureMessage );
      Assert.IsTrue( result );
      Assert.AreEqual( SunPosition.NorthWest, game.Board.SunPosition );
      Assert.AreEqual( 1, game.Revolution );
    }
    
    
    
    
    
  }
}
