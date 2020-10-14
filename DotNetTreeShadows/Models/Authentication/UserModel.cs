using System.Collections.Generic;
using System.Linq;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Authentication {
    public class UserModel:MongoUser {
      public string UserId {
            get => Id.ToString();
        }
      
      public List<SessionSummary> Sessions { get; set; } = new List<SessionSummary>();
      public List<FriendProfile> Friends { get; set; } = new List<FriendProfile>();
      public List<string> ReceivedInvitations { get; set; }= new List<string>();
      public List<string> SentInvitations  { get; set; } = new List<string>();


      public bool HasFriend (string id) => Friends.Any(f=> f.Id== id );
      
      public void AddFriend (FriendProfile friendProfile) {
        if ( Friends.Any( f => f.Id == friendProfile.Id ) ) return;
        Friends.Add( friendProfile );
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
          Name=UserName,
          Email=Email,
          Sessions = Sessions,
          Friends = Friends,
          ReceivedInvitations = ReceivedInvitations,
          SentInvitations = SentInvitations
        };

      public void RemoveSession (string sessionId) {
        Sessions.RemoveAll( sessionSummary => sessionSummary.Id == sessionId );
      }

      public void RemoveFriend (UserModel friend) {
        Friends.RemoveAll( friendSummary => friendSummary.Id == friend.UserId );
      }

      public void HandleChangeRequest (ProfilesController.ProfileInfoChangeRequest request) {
        UserName = request.Name ?? UserName;
        Email = request.Email ?? Email;
      }
      
      
      

    }
}
