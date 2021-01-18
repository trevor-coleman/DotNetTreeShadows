using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using MongoDB.Driver.Core.Connections;
using NUnit.Framework;

namespace DotNetTreeShadows.Tests {
  [TestFixture]
  public class ScoreTokensTest {

    private Game game;
    private Hex hex;

    [SetUp]
    public void SetUp () {
      game = new Game();
      hex = new Hex(0);
    }

    [Test]
    public void FourLeafTokensAreTakenInOrder () {
      int[] expectedResults = { 22, 21, 20 };

      foreach ( int t in expectedResults ) {
        bool result = ScoreTokens.Take( game, hex, out Scoring.Token? token );
        Assert.IsTrue( result );
        Assert.AreEqual( t, token.Points);
      }
    }


  }
}
