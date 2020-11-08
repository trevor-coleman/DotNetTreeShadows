using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Services.GameActionService;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

// ReSharper disable AutoPropertyCanBeMadeGetOnly.Global

namespace dotnet_tree_shadows.Models.GameModel {
  public class Game {

    public GameActionData[] ActionHistory = new GameActionData[0];

    public Dictionary<string, int> PlayerBoards = new Dictionary<string, int>();

    public int Revolution = 0;

    public Dictionary<string, Scoring.Token[]> Scores = new Dictionary<string, Scoring.Token[]>();

    public GameActionData[] UndoActions = new GameActionData[0];

    public TreeType[] RemainingTreeTypes { get; set; } = {
      TreeType.Ash, TreeType.Aspen, TreeType.Birch, TreeType.Poplar
    };

    [BsonId, BsonRepresentation( BsonType.ObjectId )]
    public string? Id { get; set; }

    [BsonRepresentation( BsonType.ObjectId )]
    public string? FirstPlayer { get; set; }

    public int CurrentTurn { get; set; }

    public string CurrentPlayer {
      get => TurnOrder[CurrentTurn];
    }

    public string[] TurnOrder { get; set; } = new string[0];

    [BsonRepresentation( BsonType.String )]
    public SunPosition SunPosition { get; set; } = SunPosition.NorthWest;

    public int turnCount { get; set; } = 0;

    public TokenStacks ScoringTokens { get; set; } = TokenStacks.StartingStacks;

    public string[] GameOptions { get; set; } = new string[0];

    public int[] TilesActiveThisTurn { get; set; } = new int[0];

    [BsonRepresentation( BsonType.String ), JsonConverter( typeof( StringEnumConverter ) )]
    public GameStatus Status { get; set; }

    public int LengthOfGame {
      get =>
        GameOptions.Contains( GameOption.LongGame )
          ? 4
          : 3;
    }

    public void SetPlayerBoard (string playerId, PlayerBoard playerBoard) {
      PlayerBoards[playerId] = playerBoard.BoardCode;
    }

    public void RandomizeTurns () {
      Random random = new Random();
      string[] array = TurnOrder.ToArray();
      int n = array.Length;

      while ( n > 1 ) {
        int k = random.Next( n-- );
        string temp = array[n];
        array[n] = array[k];
        array[k] = temp;
      }

      TurnOrder = array;
    }

    public void AddGameAction (GameActionData gameActionData) {
      void AddToUndoHistory () {
        UndoActions = UndoActions
                     .Where( action => action.Id != gameActionData.Id && action.PlayerId == gameActionData.PlayerId )
                     .Append( gameActionData )
                     .ToArray();
      }

      void AddToActionHistory () {
        ActionHistory = ActionHistory.Where( action => action.Id != gameActionData.Id )
                                     .Append( gameActionData )
                                     .ToArray();
      }

      switch ( gameActionData.ActionType ) {
        case GameActionType.Buy:
        case GameActionType.Plant:
        case GameActionType.Grow:
        case GameActionType.Collect:
          AddToActionHistory();
          AddToUndoHistory();
          return;

        case GameActionType.StartGame:
        case GameActionType.PlaceStartingTree:
        case GameActionType.PlaceSecondTree:
        case GameActionType.Resign:
        case GameActionType.Kick:
          AddToActionHistory();
          return;

        case GameActionType.EndTurn:
          AddToActionHistory();
          UndoActions = new GameActionData[0];
          return;

        case GameActionType.Undo: return;

        default: return;
      }
    }

    public bool TryGetLastAction (out GameActionData? lastAction) {
      lastAction = UndoActions.Length > 0
                     ? UndoActions.Last()
                     : (GameActionData?) null;

      return UndoActions.Length > 0;
    }

    public void RemoveGameAction (string actionId) {
      ActionHistory = ActionHistory.Where( action => action.Id != actionId ).ToArray();
      UndoActions = UndoActions.Where( action => action.Id != actionId ).ToArray();
    }

    public bool ActionIsLastAction (string actionId) =>
      UndoActions.Length != 0 && UndoActions.Last().Id == actionId;

  }
}
