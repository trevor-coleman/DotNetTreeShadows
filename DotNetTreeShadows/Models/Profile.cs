using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using dotnet_tree_shadows.Authentication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

#nullable enable
namespace dotnet_tree_shadows.Models {
    public class Profile {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;
        public string Name { get; set; }
        public List<string> Sessions { get; set; }
        public List<string> Friends { get; set; }
        public string? CurrentSessionId { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        public List<string> ReceivedInvitations;
        public List<string> SentInvitations;
        

        public Profile () {
            Name = "";
            Id = "";
            Email = "";
            Sessions = new List<string>();
            Friends = new List<string>();
            ReceivedInvitations = new List<string>();
            SentInvitations = new List<string>();
        }
        
        public Profile (ApplicationUser user) {
            Name = user.UserName;
            Id = user.Id.ToString();
            Email = user.Email;
            Sessions = new List<string>();
            Friends = new List<string>();
            ReceivedInvitations = new List<string>();
            SentInvitations = new List<string>();
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
        }

        public void AddReceivedInvitation (string id) {
            if ( ReceivedInvitations.Contains( id )  ) return;
            ReceivedInvitations.Add( id );
        }

        public void AddSentInvitation (string id) {
            if ( SentInvitations.Contains( id )) return;
            SentInvitations.Add(id );
        }

        public void AddSession (string id) {
            if ( Sessions.All( s => s != id ) ) Sessions.Add( id );
        }

        public bool HasSentInvitation (string id) => SentInvitations.Any( i => i == id );
        public bool HasReceivedInvitation (string id) => ReceivedInvitations.Any( i => i == id );
    }
}
