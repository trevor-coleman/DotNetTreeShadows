using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.SessionModels;
using NUnit.Framework;

namespace TestShadows {
    
    [TestFixture]
    public class Tests {
        private PlayerBoard board;

        [SetUp]
        public void Setup () { board = new PlayerBoard(); }

        [Test]
        public void NewBoardShouldHaveCorrectNumberOfSmallTrees () {
            Assert.AreEqual( 2,board.Pieces( PieceType.Seed ).Available  );
        }
    }
}
