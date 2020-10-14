using System.Collections.Generic;
using dotnet_tree_shadows.Models.DataModels;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.SessionModel {
  public class Session {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    public string Name { get; set; } = "Session";
    public string Host { get; set; } = "";
    public string[] Invitations { get; set; } = new string[0];
    public string[] InvitedPlayers { get; set; } = new string[0];
    public Dictionary<string, PlayerSummary> Players { get; set; } = new Dictionary<string, PlayerSummary>();
    public GameOptionsDictionary gameOptions { get; set; } = new GameOptionsDictionary();

    [BsonIgnore]
    public SessionSummary Summary {
      get => new SessionSummary( Id, Name, Host );
    }

    public bool HasPlayer (string id) => Players.ContainsKey( id ) || Host == id;

  }
}
