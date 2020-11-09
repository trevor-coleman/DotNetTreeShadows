using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameModel;
using Mongo.Migration.Documents;
using Mongo.Migration.Documents.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModel {
  [RuntimeVersion("0.0.1")]
  public class Session:IDocument {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    public string Name { get; set; } = "Session";
    public string Host { get; set; } = "";
    public string HostName { get; set; } = "";
    public string[] Invitations { get; set; } = new string[0];
    public string[] InvitedPlayers { get; set; } = new string[0];
    public Dictionary<string, PlayerSummary> Players { get; set; } = new Dictionary<string, PlayerSummary>();
    public bool? LinkEnabled = true;

    [BsonIgnore]
    public SessionSummary Summary {
      get => new SessionSummary( Id, Name, Host, HostName );
    }

    public bool HasPlayer (string id) => Players.ContainsKey( id ) || Host == id;

    public DocumentVersion Version { get; set; }

  }
}
