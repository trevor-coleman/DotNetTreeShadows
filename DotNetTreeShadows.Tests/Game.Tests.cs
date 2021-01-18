using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.GameModel;
using MongoDB.Bson;
using NUnit.Framework;

namespace DotNetTreeShadows.Tests {
  [TestFixture]
  public class GameTests {

    private Game game;
    private string[] userIds = new string[] {"1","2","3","4"};

    [SetUp]
    public void SetUp () {
      game = new Game();
    }

    [Test]
    public void UsersAddedToGameAppearInTurnOrder () {
      foreach ( string id in userIds ) {
        GameOperations.AddPlayer( game, id );
      }
      Assert.AreEqual( game.TurnOrder, userIds );
    }
  }
}
