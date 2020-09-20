using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        public Profile () {
            Id = "";
            Email = "";
            Sessions = new List<string>();
            Friends = new List<string>();
        }
        
        public Profile (ApplicationUser user) {
            Id = user.Id.ToString();
            Email = user.Email;
            Sessions = new List<string>();
            Friends = new List<string>();
        }
    }
}
