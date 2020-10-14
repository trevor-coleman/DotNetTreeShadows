using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Services {
  public class HubGroupService {

    private Dictionary<string, string[]> groups = new Dictionary<string, string[]>();
    private Dictionary<string, string[]> players = new Dictionary<string, string[]>();

    public string[] AddToGroup (string groupId, string playerId) {
      AddPlayerToGroup( groupId, playerId );
      AddGroupToPlayer( groupId, playerId );
      
      return groups[groupId];
    }

    public string[] RemoveFromGroup (string groupId, string playerId) {
      RemoveGroupFromPlayer( groupId, playerId );
      return RemovePlayerFromGroup( groupId, playerId );;
    }

    public IEnumerable<string> PlayerGroups (string playerId) =>
      players.TryGetValue(playerId, out string[] playerGroups )
        ? playerGroups
        : new string[0];

    public void RemoveFromAllGroups (string playerId) {
      if ( !players.TryGetValue( playerId, out string[] playerGroups ) ) return;
      foreach ( string groupId in playerGroups ) {
        RemoveFromGroup( groupId, playerId );
      }
    }

    private void AddGroupToPlayer (string groupId, string playerId) {
      if ( players.TryGetValue( playerId, out string[] playerGroups ) ) {
        players[playerId] = playerGroups.Where( id => id != groupId ).Append( playerId ).ToArray();
      } else {
        players[playerId] = new[] { groupId };
      }
    }

    private void AddPlayerToGroup (string groupId, string playerId) {
      if ( groups.TryGetValue( groupId, out string[] group ) ) {
        groups[groupId] = @group.Where( id => id != playerId ).Append( playerId ).ToArray();
      } else {
        groups[groupId] = new[] { playerId };
      }
    }

    private void RemoveGroupFromPlayer (string groupId, string playerId) {
      if ( players.TryGetValue( playerId, out string[] playerGroups ) ) {
        playerGroups = playerGroups.Where( id => id != groupId ).ToArray();
        if ( playerGroups.Length == 0 ) {
          players.Remove( playerId );
        } else {
          players[playerId] = playerGroups;
        }
      }
    }

    private string[] RemovePlayerFromGroup (string groupId, string playerId) {
      string[] result;
      if ( !groups.TryGetValue( groupId, out string[] group ) ) {
        result = new string[0];
      } else {
        result = @group.Where( id => id != playerId ).ToArray();
        if ( result.Length == 0 ) {
          groups.Remove( groupId );
        } else {
          groups[groupId] = result;
        }
      }

      return result;
    }

    public string[] ConnectedMembers (string groupId) => groups[groupId] ?? new string[0];
  }
}
