using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models.GameModel {
  public class Game {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string FirstPlayer { get; set; } = "";


    public int CurrentTurn { get; set; } = 0;

    public string CurrentPlayer {
      get => TurnOrder[CurrentTurn];
    }

    public string[] TurnOrder { get; set; } = new string[0];

    public int Revolution = 0;

    [BsonRepresentation( BsonType.String )]
    public SunPosition SunPosition { get; set; } = SunPosition.NorthWest;

    [BsonDictionaryOptions( DictionaryRepresentation.Document )]
    public Dictionary<string, int> PlayerBoards = new Dictionary<string, int>();

    [BsonDictionaryOptions( DictionaryRepresentation.Document )]
    public Dictionary<int, Stack<int>> ScoringTokens { get; set; } = new Dictionary<int, Stack<int>>();

    [BsonDictionaryOptions( DictionaryRepresentation.Document )]
    public GameOptionsDictionary GameOptions { get; set; } = new GameOptionsDictionary();

    public Hex[] TilesActiveThisTurn { get; set; }

    [BsonRepresentation( BsonType.String )]
    public GameStatus Status { get; set; }

    [BsonDictionaryOptions( DictionaryRepresentation.Document )]
    public Dictionary<string, Scoring.Token[]> Scores = new Dictionary<string, Scoring.Token[]>();

    public int LengthOfGame {
      get =>
        GameOptions.Has( GameOption.LongGame )
          ? 4
          : 3;
    }

  }
}
