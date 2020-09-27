using System.Collections.Generic;
using System.Security.Cryptography;
using System.Security.Policy;
using static dotnet_tree_shadows.Models.Session;

namespace dotnet_tree_shadows.Models {
    public class ProfileDTO {
        public string Name { get; set; } = "";
        public SessionSummary[] Sessions { get; set; } = {};
        public string[] Friends = { };
        public string Email { get; set; }
        public string[] ReceivedInvitations = { };
        public string[] SentInvitations = { };
    }
}
