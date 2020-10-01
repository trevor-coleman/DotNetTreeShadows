using dotnet_tree_shadows.Models.SessionModels;
using NUnit.Framework;

namespace TestShadows {
    
    [TestFixture]
    public class Tests {
        private BitwisePlayerBoard board;

        [SetUp]
        public void Setup () { board = new BitwisePlayerBoard(); }

        [Test]
        public void NewBoardShouldHaveCorrectNumberOfSmallTrees () {
            Assert.AreEqual( 2,board.Pieces( PieceType.Seed ).Available  );
        }
    }
}
