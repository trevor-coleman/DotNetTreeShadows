using System.Collections.Generic;
using System.Linq;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Authentication {
    public class UserModel:MongoUser {
      public string UserId {
            get => Id.ToString();
        }
      
      public List<SessionSummary> Sessions { get; set; } = new List<SessionSummary>();
      public List<string> Friends { get; set; } = new List<string>();
      public List<string> ReceivedInvitations { get; set; }= new List<string>();
      public List<string> SentInvitations  { get; set; } = new List<string>();

      
      public bool HasFriend (string id) => Friends.Contains( id );
      
      public void AddFriend (string id) {
        if ( Friends.Contains( id ) ) return;
        Friends.Add( id );
      }
      
      public void RemoveInvitation (string id) {
        SentInvitations.RemoveAll( s => s == id );      
        ReceivedInvitations.RemoveAll( s => s == id );      
      }
      
      public void AddReceivedInvitation (string id) {
        if ( ReceivedInvitations.Contains( id )  ) return;
        ReceivedInvitations.Add( id );
      }

      public void AddSentInvitation (string id) {
        if ( SentInvitations.Contains( id )) return;
        SentInvitations.Add(id );
      }

      public void AddSession (Session session) {
        if ( Sessions.All( s => s.Id != session.Id ) ) Sessions.Add( session.Summary);
      }
      
      public bool HasSentInvitation (string id) => SentInvitations.Any( i => i == id );
      public bool HasReceivedInvitation (string id) => ReceivedInvitations.Any( i => i == id );

      public UserProfile UserProfile () =>
        new UserProfile() {
          Id = UserId,
          Sessions = Sessions,
          Friends = Friends,
          ReceivedInvitations = ReceivedInvitations,
          SentInvitations = SentInvitations
        };

    }
}
