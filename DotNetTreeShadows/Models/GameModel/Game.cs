using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;
// ReSharper disable AutoPropertyCanBeMadeGetOnly.Global

namespace dotnet_tree_shadows.Models.GameModel {
  public class Game {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string? Id { get; set; }

    [BsonRepresentation( BsonType.ObjectId )]
    public string? FirstPlayer { get; set; }


    public int CurrentTurn { get; set; }

    public string CurrentPlayer {
      get => TurnOrder[CurrentTurn];
    }

    public string[] TurnOrder { get; set; } = new string[0];

    public int Revolution = 0;

    [BsonRepresentation( BsonType.String )]
    public SunPosition SunPosition { get; set; } = SunPosition.NorthWest;
    
    public Dictionary<string, int> PlayerBoards = new Dictionary<string, int>();
    
    public Dictionary<int, Stack<int>> ScoringTokens { get; set; } = new Dictionary<int, Stack<int>> {
      { 1, new Stack<int>( OneLeafTiles ) },
      { 2, new Stack<int>( TwoLeafTiles ) },
      { 3, new Stack<int>( ThreeLeafTiles ) },
      { 4, new Stack<int>( FourLeafTiles ) },
    };
    
    public GameOptionsDictionary GameOptions { get; set; } = new GameOptionsDictionary();

    public Hex[] TilesActiveThisTurn { get; set; }

    [BsonRepresentation( BsonType.String )]
    public GameStatus Status { get; set; }
    
    public Dictionary<string, Scoring.Token[]> Scores = new Dictionary<string, Scoring.Token[]>();

    public int LengthOfGame {
      get =>
        GameOptions.Has( GameOption.LongGame )
          ? 4
          : 3;
    }
    
    private static readonly int[] OneLeafTiles = { 14, 14, 13, 13, 12, 12, 12, 12 };
    private static readonly int[] TwoLeafTiles = { 17, 16, 16, 14, 14, 13, 13, 13 };
    private static readonly int[] ThreeLeafTiles = { 19, 18, 18, 17, 17 };
    private static readonly int[] FourLeafTiles = { 22, 21, 20 };

  }
}
