using System.Collections.Generic;
using System.Text.Json.Serialization;
using dotnet_tree_shadows.Models.DataModels;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Services {
  public class SessionInfo {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    public string Name { get; set; } = "Session";
    public string Host { get; set; } = "";
    public string[] Invitations { get; set; } = new string[0];
    public Dictionary<string, PlayerSummary> Players { get; set; }
    public GameOptionsDictionary gameOptions { get; set; } = new GameOptionsDictionary();

  }

  public class GameOptionsDictionary : Dictionary<GameOptions, bool> { }

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public enum GameOptions {
    PreventActionsInShadow,
    RandomizeTurnOrder,
    LongGame,
  }
}

