using System.Linq;
using dotnet_tree_shadows.Services;
using NUnit.Framework;

namespace DotNetTreeShadows.Test
{
    public class TestService {

      private HubGroupService hubGroupService;
      
        [SetUp]
        public void Setup() {
          hubGroupService = new HubGroupService();
        }

        [Test]
        public void AddAMemberToAGroup() {
          hubGroupService.AddToSession( "sessionA", "player1" );

          Assert.AreEqual( hubGroupService.PlayersForSession.Count, 1 );
          
          var result = hubGroupService.AddToSession( "sessionA", "player2" );
          Assert.AreEqual( hubGroupService.SessionsForPlayer.Count, 2 );
          
          Assert.AreEqual( result.Count(), 2 );
          

        }
    }
}