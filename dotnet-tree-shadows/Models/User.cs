using System.Collections.Generic;

#nullable enable
namespace dotnet_tree_shadows.Models {
    public class User {
        public string Name { get; set; }
        public List<string> Sessions { get; set; }
        public List<string> Friends { get; set; }
        public string? CurrentSessionId { get; set; }

        public User (string? name) {
            Name = name ?? "New User";
            Sessions = new List<string>();
            Friends = new List<string>();
            CurrentSessionId = null;
        }
    }
}
