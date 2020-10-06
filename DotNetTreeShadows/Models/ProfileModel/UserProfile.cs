using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models {
  public class UserProfile {
    public string Id { get; set; }
    public List<SessionSummary> Sessions { get; set; } = new List<SessionSummary>();
    public List<string> Friends { get; set; } = new List<string>();
    public List<string> ReceivedInvitations { get; set; }= new List<string>();
    public List<string> SentInvitations  { get; set; } = new List<string>();
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }

  }
}
