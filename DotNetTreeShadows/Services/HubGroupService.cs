using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Services {
  public class HubGroupService {

    public ConcurrentDictionary<string, IEnumerable<string>> PlayersForSession =
      new ConcurrentDictionary<string, IEnumerable<string>>();

    public ConcurrentDictionary<string, IEnumerable<string>> SessionsForPlayer =
      new ConcurrentDictionary<string, IEnumerable<string>>();

    public IEnumerable<string> AddToSession (string sessionId, string playerId) {
      SessionsForPlayer.AddOrUpdate(
          playerId,
          new[] { sessionId },
          (_, l) => l.Where( id => id != sessionId ).Append( sessionId )
        );

      IEnumerable<string> sessionPlayers = PlayersForSession.AddOrUpdate(
          sessionId,
          new[] { playerId },
          (_, players) => players.Where( id => id != playerId ).Append( playerId )
        );

      return sessionPlayers;
    }

    public IEnumerable<string> RemoveFromSession (string sessionId, string playerId) {
      RemoveSessionFromPlayer( sessionId, playerId );
      IEnumerable<string> playersAfter = RemovePlayerFromSession( sessionId, playerId );
      return playersAfter;
    }

    public IEnumerable<string> RemoveSessionFromPlayer (string sessionId, string playerId) {
      IEnumerable<string> sessionsAfter = new string[0];
      if ( !SessionsForPlayer.TryGetValue( playerId, out IEnumerable<string>? playerGroups ) ) return sessionsAfter;
      sessionsAfter = playerGroups.Where( id => id != sessionId );
      SessionsForPlayer.AddOrUpdate( playerId, sessionsAfter, (_, groups) => groups.Where( id => id != sessionId ) );
      return sessionsAfter;
    }

    public IEnumerable<string> RemovePlayerFromSession (string sessionId, string playerId) {
      IEnumerable<string> playersAfter = new string[0];
      if ( PlayersForSession.TryGetValue( sessionId, out IEnumerable<string>? sessionPlayers ) )
        playersAfter = sessionPlayers.Where( id => id != playerId );

      PlayersForSession.AddOrUpdate( sessionId, playersAfter, (_, players) => players.Where( id => id != playerId ) );

      return playersAfter;
    }

    public IEnumerable<string> PlayerSessions (string playerId) =>
      SessionsForPlayer.TryGetValue( playerId, out IEnumerable<string> playerGroups )
        ? playerGroups
        : new string[0];

  }
}
