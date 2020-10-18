using dotnet_tree_shadows.Models.Authentication;

namespace dotnet_tree_shadows.Models.SessionModel {
  public static class SessionOperations {
    public static  Session Create (UserModel host) {
      Session session = new Session() { Host = host.UserId};
      session.Players.Add( host.UserId, new PlayerSummary(host) );
      return session;
    }
    
    public static  Session Create (string hostId, string hostName) {
      Session session = new Session() { Host = hostId};
      session.Players.Add( hostId, new PlayerSummary() {
        Id = hostId,
        Name = hostName
      } );
      return session;
    }

  }
}
