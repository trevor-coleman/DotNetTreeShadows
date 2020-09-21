using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using dotnet_tree_shadows.Authentication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

#nullable enable
namespace dotnet_tree_shadows.Models {
    public class Profile {
        public string Name { get; set; }
        public List<string> Sessions { get; set; }
        public List<string> Friends { get; set; }
        public string? CurrentSessionId { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;
        [EmailAddress]
        public string Email { get; set; }

        public List<Invitation> ReceivedInvitations;
        public List<Invitation> SentInvitations;
        

        public Profile () {
            Name = "";
            Id = "";
            Email = "";
            Sessions = new List<string>();
            Friends = new List<string>();
            ReceivedInvitations = new List<Invitation>();
            SentInvitations = new List<Invitation>();
        }
        
        public Profile (ApplicationUser user) {
            Name = user.UserName;
            Id = user.Id.ToString();
            Email = user.Email;
            Sessions = new List<string>();
            Friends = new List<string>();
            ReceivedInvitations = new List<Invitation>();
            SentInvitations = new List<Invitation>();
        }

        public bool IsFriendsWith (string id) => Friends.Contains( id );
        public bool IsFriendsWith (Profile profile) => IsFriendsWith( profile.Id );
        public bool HasSentInvitation (Invitation i) => SentInvitations.Any( i.IsDuplicate );
        public bool HasReceivedInvitation (Invitation i) => ReceivedInvitations.Any( i.IsDuplicate );

        public void AddFriend (string id) {
            if ( Friends.Contains( id ) ) return;
            Friends.Add( id );
        }
        
        public void AddFriend (Profile profile) => AddFriend( profile.Id );

        public void RemoveInvitation (Invitation invitation) {
            SentInvitations.RemoveAll( invitation.IsDuplicate );
            ReceivedInvitations.RemoveAll( invitation.IsDuplicate );
        }
        public void RemoveInverseInvitation (Invitation invitation) {
            SentInvitations.RemoveAll( invitation.IsInverse );
            ReceivedInvitations.RemoveAll( invitation.IsInverse );
        }
        
        
    }

    public enum InvitationStatus {
        Pending,
        Accepted,
        Declined,
        Cancelled,
        Error,
    }

}
