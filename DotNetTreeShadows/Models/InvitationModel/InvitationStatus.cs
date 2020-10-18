using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.InvitationModel {
  [JsonConverter( typeof( StringEnumConverter ) )]
  public enum InvitationStatus {
    Pending,
    Accepted,
    Declined,
    Cancelled,
  }
}
