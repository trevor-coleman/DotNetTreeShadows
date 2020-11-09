using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using dotnet_tree_shadows.Models.SessionModel;
using Mongo.Migration.Documents;
using Mongo.Migration.Documents.Attributes;

namespace dotnet_tree_shadows.Models.ProfileModel {
  [RuntimeVersion("0.0.1")]
  public class UserProfile:IDocument {
    public string Id { get; set; }
    public List<SessionSummary> Sessions { get; set; } = new List<SessionSummary>();
    public List<FriendProfile> Friends { get; set; } = new List<FriendProfile>();
    public List<string> ReceivedInvitations { get; set; }= new List<string>();
    public List<string> SentInvitations  { get; set; } = new List<string>();
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }

    public DocumentVersion Version { get; set; }

  }
}
