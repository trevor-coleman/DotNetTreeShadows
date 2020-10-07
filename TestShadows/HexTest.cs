using dotnet_tree_shadows.Models.SessionModels;
using NUnit.Framework;

namespace TestShadows {
  public class HexTest {

    [SetUp]
    public void Setup () { }

    [Test]
    public void ShouldEncodeAndDecodeCorrectly () {
      for (int i = -4; i <= 4; i++) {
        for (int j = -4; j <= 4; j++) {
          int k = 0 - i - j;

          Hex h = new Hex( i, j, k );

          Assert.AreEqual( i, h.Q );
          Assert.AreEqual( j, h.R );
          Assert.AreEqual( k, h.S );

        }
      }
    }

  }
}
