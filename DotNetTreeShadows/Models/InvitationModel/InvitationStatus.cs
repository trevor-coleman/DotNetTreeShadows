using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models {
  [JsonConverter( typeof( StringEnumConverter ) )]
  public enum InvitationStatus {
    Pending,
    Accepted,
    Declined,
    Cancelled,
  }
}
