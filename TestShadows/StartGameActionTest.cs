using System;
using System.Linq;
using System.Security.Cryptography;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameActions.HostActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.SessionModels;
using NUnit.Framework;

namespace TestShadows {
  [TestFixture]
  public class StartGameActionTest {
    private Game game;
    
    [SetUp]
    public void Setup () {
      game = new Game("player0");
      game.AddPlayer( "player1");
      game.AddPlayer( "player2");
      game.AddPlayer( "player3");
    }

    [Test]
    public void ShouldFailIfFewerThanTwoPlayers () {
      game = new Game("player0");
      StartGameAction startGameAction = new StartGameAction(game, "player0");
      bool result = startGameAction.Execute( out string? failureMessage );
      Assert.IsFalse( result, "GameStartAction.Execute() returned true. " );
      Assert.IsNotNull( failureMessage, "GameStartAction.Execute() returned a null failureMessage " );
    }

    [Test] public void ShouldShuffleTurnOrderWhenStartingGameIfRandomStartOrderIsTrue () {
      int count = 0;
      for (int i = 0; i < 100; i++) {
        game = new Game(
            "player0",
            new Game.GameOptions { LongGame = false, PreventActionsInShadow = true, RandomizeTurnOrder = true }
          );
        game.AddPlayer( "player1");
        game.AddPlayer( "player2");
        game.AddPlayer( "player3");
        string[] turnOrder = game.TurnOrder.ToArray();
        game.Start();
        bool sameOrder = !turnOrder.Where( (t, j) => game.TurnOrder[j] != t ).Any();
        if ( sameOrder ) count++;
      }

      Assert.Less( count, 10, $"TurnOrder was the same after {count} / 100 shuffles -- expected ~{100/(4*3*2)} times -- (could be bad luck)"  );

    }
    
    [Test] public void ShouldNotShuffleTurnOrderWhenStartingGameIfRandomStartOrderIsFalse () {
      int count = 0;
      for (int i = 0; i < 10; i++) {
        game = new Game( "player0", new Game.GameOptions { LongGame = false, PreventActionsInShadow = true, RandomizeTurnOrder = false } );

        game.AddPlayer( "player1");
        game.AddPlayer( "player2");
        game.AddPlayer( "player3");
        string[] turnOrder = game.TurnOrder.ToArray();
        game.Start();
        bool sameOrder = !turnOrder.Where( (t, j) => game.TurnOrder[j] != t ).Any();
        if ( sameOrder ) count++;
      }

      Assert.AreEqual( 10, count, $"TurnOrder was the same after {count} / 10 shuffles -- expected 10 times."  );

    }
  }
}
