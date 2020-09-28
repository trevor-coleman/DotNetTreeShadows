using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

#nullable enable
namespace dotnet_tree_shadows.Models {
    public class Profile {
        [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id { get; set; } = "";

        public string Name { get; set; } = "";
        public List<SessionSummary> Sessions { get; set; } = new List<SessionSummary>();
        
        public List<string> Friends { get; set; } = new List<string>();
        [EmailAddress]
        public string Email { get; set; }

        public List<string> ReceivedInvitations { get; set; }= new List<string>();
        public List<string> SentInvitations  { get; set; } = new List<string>();

        public Profile () { }

        public Profile (ApplicationUser user) {
            Name = user.UserName;
            Id = user.Id.ToString();
            Email = user.Email;
        }

        public bool HasFriend (string id) => Friends.Contains( id );
        public bool HasFriend (Profile profile) => HasFriend( profile.Id );

        public void AddFriend (string id) {
            if ( Friends.Contains( id ) ) return;
            Friends.Add( id );
        }
        
        public void AddFriend (Profile profile) => AddFriend( profile.Id );

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

        public ProfileDTO DTO () =>
            new ProfileDTO {
                               Name = Name,
                               Sessions = Sessions.ToArray(),
                               Friends = Friends.ToArray(),
                               Email = Email,
                               ReceivedInvitations = ReceivedInvitations.ToArray(),
                               SentInvitations = SentInvitations.ToArray()
                           };
    }
}


