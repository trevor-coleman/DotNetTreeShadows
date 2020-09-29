using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models {
    public class ProfileDto {
        public string Name { get; set; } = "";
        public SessionSummary[] Sessions { get; set; } = {};
        public string[] Friends = { };
        public string Email { get; set; } = "";
        public string[] ReceivedInvitations = { };
        public string[] SentInvitations = { };
    }
}
